using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public ClienteDto ClienteDto{ get; set; }
        public string Role { get; set; }
        public bool EmailConfirmado { get; set; }

        public UserDto() { }

        public UserDto(User user)
        {
            this.Id = user.Id.AsGuid();
            this.UserName = user.UserName.Nome;
            this.ClienteDto = user.Cliente != null ? new ClienteDto(user.Cliente) : new ClienteDto();
            this.Role = user.Role;
            this.EmailConfirmado = user.EmailConfirmado;
        }
    }
}
