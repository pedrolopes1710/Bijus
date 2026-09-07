using System.Threading.Tasks;
using dddnetcore.Domain.Emails;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/newsletter")]
    [ApiController]
    public class NewsletterController : ControllerBase
    {
        private readonly IEmailService _email;
        public NewsletterController(IEmailService email) => _email = email;

        public class SubscreverDto
        {
            public string Email { get; set; }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Subscrever([FromBody] SubscreverDto dto)
        {
            var email = dto?.Email?.Trim();
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
                return BadRequest(new { message = "Email inválido." });

            var corpo = @"<div style=""font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden"">
  <div style=""background:#2b1a22;color:#fff;padding:20px 28px;font-size:20px;font-weight:bold"">Biscuit&amp;Arte</div>
  <div style=""padding:28px"">
    <h2 style=""margin:0 0 16px;color:#2b1a22"">Subscrição confirmada ✨</h2>
    <p style=""color:#444;font-size:15px;line-height:1.6;margin:0"">Obrigada por te juntares à nossa lista! Vais receber em primeira mão os novos lançamentos, reposições e campanhas — com a mesma curadoria da montra.</p>
  </div>
  <div style=""background:#faf6f2;color:#999;padding:16px 28px;font-size:12px"">Feito à mão em Portugal · Biscuit&amp;Arte</div>
</div>";

            await _email.EnviarAsync(email, "Bem-vindo à Biscuit&Arte ✨", corpo);
            return Ok(new { message = "Subscrição registada.", emailEnviado = _email.Configurado });
        }
    }
}
