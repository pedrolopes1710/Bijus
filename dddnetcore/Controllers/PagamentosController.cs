using System.Security.Claims;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Pagamentos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace DDDSample1.Controllers
{
    [Route("api/pagamentos/stripe")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly StripePagamentoService _service;
        public PagamentosController(StripePagamentoService service) => _service = service;

        [HttpPost("checkout")]
        [Authorize]
        public async Task<ActionResult<CheckoutMbWayDto>> CriarCheckout(CriarCheckoutMbWayDto dto)
        {
            if (!TryGetClienteId(out var clienteId)) return Unauthorized();
            try { return Ok(await _service.CriarCheckoutAsync(dto.VendaId, clienteId)); }
            catch (BusinessRuleValidationException ex) { return BadRequest(new { ex.Message }); }
            catch (StripeException ex) { return StatusCode(502, new { message = ex.StripeError?.Message ?? "Não foi possível iniciar o MB WAY." }); }
        }

        [HttpGet("sessoes/{sessionId}")]
        [Authorize]
        public async Task<ActionResult<EstadoPagamentoDto>> ObterEstado(string sessionId)
        {
            if (!TryGetClienteId(out var clienteId)) return Unauthorized();
            try { return Ok(await _service.ObterEstadoAsync(sessionId, clienteId)); }
            catch (BusinessRuleValidationException ex) { return BadRequest(new { ex.Message }); }
            catch (StripeException ex) { return StatusCode(502, new { message = ex.StripeError?.Message ?? "Não foi possível confirmar o pagamento." }); }
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            var payload = await new StreamReader(Request.Body).ReadToEndAsync();
            try
            {
                await _service.ProcessarWebhookAsync(payload, Request.Headers["Stripe-Signature"].ToString());
                return Ok();
            }
            catch (StripeException) { return BadRequest(); }
            catch (BusinessRuleValidationException) { return StatusCode(503); }
        }

        private bool TryGetClienteId(out Guid clienteId) =>
            Guid.TryParse(User.FindFirstValue("cliente_id"), out clienteId);
    }
}
