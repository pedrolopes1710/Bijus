using dddnetcore.Domain.VendaProdutos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.VendaProdutos
{
    public class VendaProdutoRepository : BaseRepository<VendaProduto, VendaProdutoId>, IVendaProdutoRepository
    {
        private readonly DDDSample1DbContext _context;

        public VendaProdutoRepository(DDDSample1DbContext context) : base(context.VendaProdutos)
        {
            _context = context;
        }

        public async Task<List<VendaProduto>> GetVendaProdutosByVendaAsync(Guid? vendaId = null)
        {
            if (vendaId == null) return await GetAllAsync();

            // Filtra por venda em memória para evitar erro de tradução EF do value object VendaId.
            var todos = await _context.VendaProdutos
                .Include(vp => vp.Venda)
                .Include(vp => vp.Produto)
                .ToListAsync();

            return todos
                .Where(vp => vp.Venda != null && vp.Venda.Id.AsGuid() == vendaId.Value)
                .ToList();
        }

        public new async Task<List<VendaProduto>> GetAllAsync()
        {
            return await _context.VendaProdutos
                .Include(vp => vp.Venda)
                .Include(vp => vp.Produto)
                .ToListAsync();
        }
    }
}