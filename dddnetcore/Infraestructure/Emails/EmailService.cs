using System;
using System.Threading.Tasks;
using dddnetcore.Domain.Emails;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace dddnetcore.Infraestructure.Emails
{
    /// <summary>
    /// Envio de emails via SMTP (ex.: Hostinger). Se as credenciais não estiverem
    /// definidas, o serviço não faz nada (não bloqueia o fluxo da loja).
    /// Variáveis: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_FROM_NAME.
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _user;
        private readonly string _password;
        private readonly string _from;
        private readonly string _fromName;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _logger = logger;
            _host = Get(config, "Smtp:Host", "SMTP_HOST");
            _user = Get(config, "Smtp:User", "SMTP_USER");
            _password = Get(config, "Smtp:Password", "SMTP_PASSWORD");
            _from = Get(config, "Smtp:From", "SMTP_FROM");
            _fromName = Get(config, "Smtp:FromName", "SMTP_FROM_NAME");
            if (string.IsNullOrWhiteSpace(_fromName)) _fromName = "Biscuit&Arte";
            if (string.IsNullOrWhiteSpace(_from)) _from = _user;
            var portRaw = Get(config, "Smtp:Port", "SMTP_PORT");
            _port = int.TryParse(portRaw, out var p) ? p : 587;
        }

        private static string Get(IConfiguration config, string key, string env)
            => config[key] ?? Environment.GetEnvironmentVariable(env) ?? string.Empty;

        public bool Configurado => !string.IsNullOrWhiteSpace(_host) && !string.IsNullOrWhiteSpace(_user);

        public async Task EnviarAsync(string para, string assunto, string corpoHtml)
        {
            if (!Configurado)
            {
                _logger.LogInformation("SMTP não configurado — email para {Para} ({Assunto}) ignorado.", para, assunto);
                return;
            }
            if (string.IsNullOrWhiteSpace(para)) return;

            try
            {
                var msg = new MimeMessage();
                msg.From.Add(new MailboxAddress(_fromName, _from));
                msg.To.Add(MailboxAddress.Parse(para));
                msg.Subject = assunto;
                msg.Body = new BodyBuilder { HtmlBody = corpoHtml }.ToMessageBody();

                using var client = new SmtpClient();
                var seguranca = _port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                await client.ConnectAsync(_host, _port, seguranca);
                await client.AuthenticateAsync(_user, _password);
                await client.SendAsync(msg);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // Nunca deixar o email quebrar o fluxo principal.
                _logger.LogError(ex, "Falha ao enviar email para {Para}", para);
            }
        }
    }
}
