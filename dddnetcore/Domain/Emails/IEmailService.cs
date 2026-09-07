using System.Threading.Tasks;

namespace dddnetcore.Domain.Emails
{
    public interface IEmailService
    {
        bool Configurado { get; }
        Task EnviarAsync(string para, string assunto, string corpoHtml);
    }
}
