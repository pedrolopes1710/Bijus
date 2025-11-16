using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public UserName UserName { get; private set; }
        public UserPassword UserPassword {get; private set;}
        public Cliente Cliente {get; private set;}
           
        private User() { }

        public User(
            UserName userName,
            UserPassword userPassword,
            Cliente cliente
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
        }

    }
}