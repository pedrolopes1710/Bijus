using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.Emails;
using dddnetcore.Domain.Users;

namespace dddnetcore.Domain.Vendas
{
    public class VendaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVendaRepository _repo;
        private readonly IClienteRepository _clienteRepo;
        private readonly IEmailService _email;
        private readonly IUserRepository _userRepo;

        public VendaService(IUnitOfWork unitOfWork, IVendaRepository repo, IClienteRepository clienteRepo, IEmailService email, IUserRepository userRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._clienteRepo = clienteRepo;
            this._email = email;
            this._userRepo = userRepo;
        }

        public async Task<List<VendaDto>> GetAllAsync(Guid? clienteId = null) {
            if (clienteId != null) {
                return (await this._repo.GetVendasAsync(clienteId)).ConvertAll(venda => new VendaDto(venda));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(venda => new VendaDto(venda));
        }
        public async Task<VendaDto> GetByIdAsync(VendaId id)
        {
            var venda = await this._repo.GetByIdAsync(id);
            return venda == null ? null : new VendaDto(venda);
        }

        public async Task<bool> PertenceAoClienteAsync(Guid vendaId, Guid clienteId)
        {
            var venda = await _repo.GetDetalheAsync(new VendaId(vendaId));
            return venda != null && venda.Cliente.Id.AsGuid() == clienteId;
        }

        public async Task<VendaDto> AddAsync(CreatingVendaDto dto)
        {
            if (!Enum.TryParse<VendaEstado>(dto.Estado, out var status))
            {
                throw new BusinessRuleValidationException($"Status inválido: {dto.Estado}");
            }

            // A conta tem de ter o email confirmado antes de finalizar uma compra.
            var utilizador = await this._userRepo.GetUserByClientAsync(dto.ClienteId);
            if (utilizador != null && !utilizador.EmailConfirmado)
            {
                throw new BusinessRuleValidationException("Confirma o teu email antes de finalizar a compra. Verifica a tua caixa de entrada.");
            }

            var cliente = await this._clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var venda = new Venda(
                new VendaData(dto.Data),
                status,
                new VendaTotal(dto.Total),
                cliente,
                dto.Transportadora,
                dto.CodigoRastreio,
                dto.UrlRastreio,
                dto.DataEnvio,
                dto.NotasInternas
            );

            await this._repo.AddAsync(venda);
            await this._unitOfWork.CommitAsync();

            await EnviarEmailEncomendaRecebida(venda, cliente);

            return new VendaDto(venda);
        }

       public async Task<VendaDto> UpdateAsync(VendaDto dto)
        {
            var venda = await this._repo.GetByIdAsync(new VendaId(dto.Id));

            if (venda == null)
                return null;

            var estadoAnterior = venda.VendaEstado;

            if (!Enum.TryParse<VendaEstado>(dto.VendaEstado, ignoreCase: true, out var status))
            {
                throw new BusinessRuleValidationException($"Estado inválido: {dto.VendaEstado}");
            }

            venda.AtualizarDados(
                new VendaData(dto.VendaData),
                status,
                new VendaTotal(dto.VendaTotal)
            );

            venda.AtualizarRastreio(
                dto.Transportadora,
                dto.CodigoRastreio,
                dto.UrlRastreio,
                dto.DataEnvio,
                dto.NotasInternas
            );

            await this._unitOfWork.CommitAsync();

            if (estadoAnterior != VendaEstado.enviada && status == VendaEstado.enviada)
            {
                var detalhe = await this._repo.GetDetalheAsync(new VendaId(dto.Id));
                await EnviarEmailEncomendaEnviada(detalhe ?? venda);
            }

            return new VendaDto(venda);
        }

        private async Task EnviarEmailEncomendaRecebida(Venda venda, Cliente cliente)
        {
            var email = cliente?.EmailCliente?.Email;
            if (string.IsNullOrWhiteSpace(email)) return;

            var nome = cliente?.NomeCliente?.Nome ?? "Cliente";
            var numero = venda.Id.AsGuid().ToString().Substring(0, 8).ToUpper();
            var total = venda.VendaTotal.Total.ToString("0.00");
            var corpo = LayoutEmail(
                "Encomenda recebida ✨",
                $"Olá {nome},<br><br>Recebemos a tua encomenda <strong>#{numero}</strong> no valor de <strong>{total} €</strong>. " +
                "Vamos prepará-la com todo o cuidado e avisamos-te quando seguir viagem.<br><br>Obrigada por escolheres a Biscuit&Arte!");
            await _email.EnviarAsync(email, $"Encomenda #{numero} recebida — Biscuit&Arte", corpo);
        }

        private async Task EnviarEmailEncomendaEnviada(Venda venda)
        {
            var email = venda?.Cliente?.EmailCliente?.Email;
            if (string.IsNullOrWhiteSpace(email)) return;

            var nome = venda.Cliente?.NomeCliente?.Nome ?? "Cliente";
            var numero = venda.Id.AsGuid().ToString().Substring(0, 8).ToUpper();
            var rastreio = "";
            if (!string.IsNullOrWhiteSpace(venda.Transportadora) || !string.IsNullOrWhiteSpace(venda.UrlRastreio))
            {
                rastreio = "<br><br>";
                if (!string.IsNullOrWhiteSpace(venda.Transportadora))
                    rastreio += $"Transportadora: <strong>{venda.Transportadora}</strong><br>";
                if (!string.IsNullOrWhiteSpace(venda.CodigoRastreio))
                    rastreio += $"Código de rastreio: <strong>{venda.CodigoRastreio}</strong><br>";
                if (!string.IsNullOrWhiteSpace(venda.UrlRastreio))
                    rastreio += $"<a href=\"{venda.UrlRastreio}\" style=\"color:#b03a5b\">Seguir a encomenda</a>";
            }

            var corpo = LayoutEmail(
                "A tua encomenda foi enviada 🚚",
                $"Olá {nome},<br><br>A encomenda <strong>#{numero}</strong> já saiu do nosso atelier e está a caminho.{rastreio}<br><br>Até já!");
            await _email.EnviarAsync(email, $"Encomenda #{numero} enviada — Biscuit&Arte", corpo);
        }

        private static string LayoutEmail(string titulo, string conteudoHtml)
        {
            return $@"<div style=""font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden"">
  <div style=""background:#2b1a22;color:#fff;padding:20px 28px;font-size:20px;font-weight:bold"">Biscuit&amp;Arte</div>
  <div style=""padding:28px"">
    <h2 style=""margin:0 0 16px;color:#2b1a22;font-size:20px"">{titulo}</h2>
    <p style=""color:#444;font-size:15px;line-height:1.6;margin:0"">{conteudoHtml}</p>
  </div>
  <div style=""background:#faf6f2;color:#999;padding:16px 28px;font-size:12px"">Feito à mão em Portugal · Biscuit&amp;Arte</div>
</div>";
        }

        public async Task<VendaDto> DeleteAsync(VendaId id)
        {
            var venda = await this._repo.GetByIdAsync(id);

            if (venda == null)
                return null;

            this._repo.Remove(venda);
            await this._unitOfWork.CommitAsync();

            return new VendaDto(venda);
        }
    }
}
