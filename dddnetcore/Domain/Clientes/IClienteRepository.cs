using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public interface IClienteRepository : IRepository<Cliente, ClienteId>
    {
        //public Task<List<Cliente>> GetClientesAsync();
        Task<Cliente> UpdateAsync(Cliente Cliente);
    }
}