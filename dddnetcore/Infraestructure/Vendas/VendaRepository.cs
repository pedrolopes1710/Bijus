using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.Vendas;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;


namespace dddnetcore.Infraestructure.Vendas
{
    public class VendaRepository : BaseRepository<Venda, VendaId>, IVendaRepository
    {
        private readonly DDDSample1DbContext _context;

        public VendaRepository(DDDSample1DbContext context) : base(context.Produtos)
        {
            _context = context;
        }
        public async Task<List<Venda>> GetVendasAsync(Guid? clienteId = null)
        {
            if (clienteId == null) return await GetAllAsync();

            var query = _context.Vendas.AsQueryable();

            query = query.Where(venda => venda.Cliente.Id.Equals(new ClienteId(clienteId.Value)))
                .Include(o => o.Categoria);

            return await query.ToListAsync();
        }
        public async Task<Venda> UpdateAsync(Venda venda)
        {
            _context.Vendas.Update(venda);
            await _context.SaveChangesAsync();
            return venda;
        }
        public new async Task<List<Venda>> GetAllAsync() {
            return await _context.Vendas
                .Include(o => o.Cliente)
                .ToListAsync();
        }
    }
}