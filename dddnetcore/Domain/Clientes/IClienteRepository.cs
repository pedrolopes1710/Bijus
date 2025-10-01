using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Clientes
{
    public interface IClienteRepository : IRepository<Cliente, ClienteId>
    {
        //public Task<List<Cliente>> GetClientesAsync();
        Task<Cliente> UpdateAsync(Cliente Cliente);
    }
}