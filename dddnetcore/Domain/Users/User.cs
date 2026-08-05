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
