using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public UserName UserName { get; private set; }
        public UserPassword UserPassword {get; private set;}
        public Cliente Cliente {get; private set;}
        public string Role { get; private set; }

        // Confirmação de conta por email.
        public bool EmailConfirmado { get; private set; }
        public string? TokenConfirmacao { get; private set; }
        public DateTime? TokenConfirmacaoExpira { get; private set; }

        private User() { }

        public User(
            UserName userName,
            UserPassword userPassword,
            Cliente cliente,
            string role = "cliente"
            )
        {
            if (userName == null)
            throw new BusinessRuleValidationException("UserName cannot be null.");

            if (userPassword == null)
            throw new BusinessRuleValidationException("UserPassword cannot be null.");

            this.Id = new UserId(Guid.NewGuid());
            this.UserName = userName;
            this.UserPassword = userPassword;   
            this.Cliente = cliente;
            this.Role = NormalizeRole(role);
        }

        public void AtualizarDados(UserName userName, Cliente cliente, string role = "cliente")
        {
            if (userName == null)
                throw new BusinessRuleValidationException("UserName cannot be null.");

            if (cliente == null)
                throw new BusinessRuleValidationException("Cliente cannot be null.");

            this.UserName = userName;
            this.Cliente = cliente;
            this.Role = NormalizeRole(role);
        }

        /// <summary>
        /// Gera um novo token de confirmação de email (válido por N horas) e marca a conta como não confirmada.
        /// </summary>
        public string GerarTokenConfirmacao(int horasValidade = 48)
        {
            this.EmailConfirmado = false;
            this.TokenConfirmacao = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            this.TokenConfirmacaoExpira = DateTime.UtcNow.AddHours(horasValidade);
            return this.TokenConfirmacao;
        }

        /// <summary>Confirma a conta e invalida o token.</summary>
        public void ConfirmarEmail()
        {
            this.EmailConfirmado = true;
            this.TokenConfirmacao = null;
            this.TokenConfirmacaoExpira = null;
        }

        /// <summary>Marca a conta como confirmada sem token (contas de confiança: backoffice / login Google verificado).</summary>
        public void MarcarEmailConfirmado() => ConfirmarEmail();

        public bool TokenConfirmacaoExpirado()
            => this.TokenConfirmacaoExpira != null && this.TokenConfirmacaoExpira < DateTime.UtcNow;

        private static string NormalizeRole(string role)
        {
            var normalized = string.IsNullOrWhiteSpace(role) ? "cliente" : role.Trim().ToLowerInvariant();

            return normalized switch
            {
                "superadmin" => "superadmin",
                "admin" => "admin",
                _ => "cliente"
            };
        }

    }
}
