using System.Text.Json;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.VendaProdutos;
using dddnetcore.Domain.Vendas;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace dddnetcore.Domain.Pagamentos
{
    public class StripePagamentoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVendaRepository _vendaRepo;
        private readonly IVendaProdutoRepository _linhaRepo;
        private readonly IProdutoRepository _produtoRepo;
        private readonly string _secretKey;
        private readonly string _webhookSecret;
        private readonly string _siteUrl;

        public StripePagamentoService(
            IUnitOfWork unitOfWork,
            IVendaRepository vendaRepo,
            IVendaProdutoRepository linhaRepo,
            IProdutoRepository produtoRepo,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _vendaRepo = vendaRepo;
            _linhaRepo = linhaRepo;
            _produtoRepo = produtoRepo;
            _secretKey = configuration["Stripe:SecretKey"] ?? string.Empty;
            _webhookSecret = configuration["Stripe:WebhookSecret"] ?? string.Empty;
            _siteUrl = (configuration["PublicSiteUrl"] ?? "http://localhost").TrimEnd('/');
        }

        public async Task<CheckoutMbWayDto> CriarCheckoutAsync(Guid vendaId, Guid clienteId)
        {
            ValidarConfiguracao(requireWebhook: false);
            var venda = await _vendaRepo.GetDetalheAsync(new VendaId(vendaId));
            if (venda == null) throw new BusinessRuleValidationException("Encomenda não encontrada.");
            if (venda.Cliente.Id.AsGuid() != clienteId)
                throw new BusinessRuleValidationException("A encomenda não pertence ao utilizador autenticado.");
            if (venda.VendaEstado == VendaEstado.paga)
                throw new BusinessRuleValidationException("Esta encomenda já se encontra paga.");

            var linhas = await _linhaRepo.GetVendaProdutosByVendaAsync(vendaId);
            if (linhas.Count == 0) throw new BusinessRuleValidationException("A encomenda não tem produtos.");

            var lineItems = new List<SessionLineItemOptions>();
            decimal total = 0;

            foreach (var linha in linhas)
            {
                var produto = await _produtoRepo.GetDetalheAsync(linha.Produto.Id);
                if (produto == null) throw new BusinessRuleValidationException("Um dos produtos deixou de estar disponível.");
                var produtoDto = new ProdutoDto(produto);
                var preco = ObterPreco(produtoDto, linha.DetalhesVariante);
                var stock = ObterStock(produtoDto, linha.DetalhesVariante);

                if (linha.Quantidade.Value > stock)
                    throw new BusinessRuleValidationException($"Stock insuficiente para {produtoDto.Nome}.");

                var centimos = (long)Math.Round(preco * 100m, MidpointRounding.AwayFromZero);
                total += preco * linha.Quantidade.Value;
                lineItems.Add(new SessionLineItemOptions
                {
                    Quantity = linha.Quantidade.Value,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = centimos,
                        ProductData = new SessionLineItemPriceDataProductDataOptions { Name = produtoDto.Nome }
                    }
                });
            }

            var client = new StripeClient(_secretKey);
            var service = new SessionService(client);
            var options = new SessionCreateOptions
            {
                Mode = "payment",
                PaymentMethodTypes = new List<string> { "mb_way" },
                CustomerEmail = venda.Cliente.EmailCliente.Email,
                SuccessUrl = $"{_siteUrl}/pedido-confirmado?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{_siteUrl}/checkout?pagamento=cancelado",
                LineItems = lineItems,
                Metadata = new Dictionary<string, string> { ["venda_id"] = vendaId.ToString() },
                PaymentIntentData = new SessionPaymentIntentDataOptions
                {
                    Metadata = new Dictionary<string, string> { ["venda_id"] = vendaId.ToString() }
                }
            };

            var session = await service.CreateAsync(options, new RequestOptions
            {
                IdempotencyKey = $"mbway-venda-{vendaId}"
            });

            venda.PrepararPagamento("mbway", "stripe", session.Id, session.PaymentStatus ?? "unpaid", (double)total);
            await _unitOfWork.CommitAsync();

            return new CheckoutMbWayDto { VendaId = vendaId, SessionId = session.Id, Url = session.Url };
        }

        public async Task<EstadoPagamentoDto> ObterEstadoAsync(string sessionId, Guid clienteId)
        {
            ValidarConfiguracao(requireWebhook: false);
            var session = await new SessionService(new StripeClient(_secretKey)).GetAsync(sessionId);
            var vendaId = ObterVendaId(session);
            var venda = await _vendaRepo.GetDetalheAsync(new VendaId(vendaId));
            if (venda == null || venda.Cliente.Id.AsGuid() != clienteId)
                throw new BusinessRuleValidationException("Pagamento não encontrado.");

            var pago = session.PaymentStatus == "paid";
            venda.AtualizarPagamento(session.PaymentStatus ?? session.Status ?? "unknown", pago);
            await _unitOfWork.CommitAsync();
            return new EstadoPagamentoDto { VendaId = vendaId, Estado = venda.PagamentoEstado ?? "unknown", Pago = pago };
        }

        public async Task ProcessarWebhookAsync(string payload, string signature)
        {
            ValidarConfiguracao(requireWebhook: true);
            var stripeEvent = EventUtility.ConstructEvent(payload, signature, _webhookSecret);
            if (stripeEvent.Data.Object is not Session session) return;

            var pago = stripeEvent.Type is "checkout.session.completed" or "checkout.session.async_payment_succeeded"
                && session.PaymentStatus == "paid";
            var falhou = stripeEvent.Type is "checkout.session.async_payment_failed" or "checkout.session.expired";
            if (!pago && !falhou) return;

            var vendaId = ObterVendaId(session);
            var venda = await _vendaRepo.GetDetalheAsync(new VendaId(vendaId));
            if (venda == null) return;
            venda.AtualizarPagamento(pago ? "paid" : stripeEvent.Type, pago);
            await _unitOfWork.CommitAsync();
        }

        private static Guid ObterVendaId(Session session)
        {
            if (session.Metadata == null || !session.Metadata.TryGetValue("venda_id", out var raw) || !Guid.TryParse(raw, out var id))
                throw new BusinessRuleValidationException("A sessão de pagamento não contém uma encomenda válida.");
            return id;
        }

        private static decimal ObterPreco(ProdutoDto produto, string? detalhes)
        {
            var variante = ObterVariante(produto, detalhes);
            return Convert.ToDecimal(variante?.Preco ?? produto.Preco);
        }

        private static int ObterStock(ProdutoDto produto, string? detalhes) =>
            ObterVariante(produto, detalhes)?.Stock ?? produto.Stock;

        private static ProdutoVarianteDto? ObterVariante(ProdutoDto produto, string? detalhes)
        {
            if (string.IsNullOrWhiteSpace(detalhes)) return null;
            try
            {
                var valores = JsonSerializer.Deserialize<Dictionary<string, string>>(detalhes);
                return produto.Variantes.FirstOrDefault(variante => variante.Ativa && valores != null &&
                    valores.All(valor => variante.Valores.TryGetValue(valor.Key, out var atual) && atual == valor.Value));
            }
            catch (JsonException) { return null; }
        }

        private void ValidarConfiguracao(bool requireWebhook)
        {
            if (string.IsNullOrWhiteSpace(_secretKey))
                throw new BusinessRuleValidationException("O pagamento MB WAY ainda não está configurado.");
            if (requireWebhook && string.IsNullOrWhiteSpace(_webhookSecret))
                throw new BusinessRuleValidationException("O webhook Stripe ainda não está configurado.");
        }
    }
}
