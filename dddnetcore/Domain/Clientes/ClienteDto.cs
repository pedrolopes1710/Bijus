using System;
using dddnetcore.Domain.Categorias;

namespace dddnetcore.Domain.Clientes
{
    public class ClienteDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Morada { get; set; }

        public ClienteDto() { }

        public ClienteDto(Cliente cliente)
        {
            this.Id = cliente.Id.AsGuid();
            this.Nome = cliente.NomeCliente.Nome;
            this.Email = cliente.EmailCliente.Email;
            this.Morada = cliente.MoradaCliente.Morada;
        }
    }
}