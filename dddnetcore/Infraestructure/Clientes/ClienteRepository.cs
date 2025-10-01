using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dddnetcore.Domain.Clientes;

using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;

namespace dddnetcore.Infraestructure.Clientes
{
    public class ClienteRepository : BaseRepository<Cliente, ClienteId>, IClienteRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public ClienteRepository(DDDSample1DbContext context) : base(context.Clientes)
        {
            _context = context;
        }

        public async Task<Cliente> UpdateAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }
    }
}