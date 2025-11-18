using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public interface IClienteRepository : IRepository<Cliente, ClienteId>
    {
        //public Task<List<Cliente>> GetClientesAsync();
        public Task<Cliente>GetByEmailAsync(String username);
        Task<Cliente> UpdateAsync(Cliente Cliente);
    }
}