using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public ClienteDto ClienteDto{ get; set; }

        public UserDto() { }

        public UserDto(User user)
        {
            this.Id = user.Id.AsGuid();
            this.UserName = user.UserName.Nome;
            this.UserPassword = user.UserPassword.Password;
            this.ClienteDto = new ClienteDto(user.Cliente);
        }
    }
}