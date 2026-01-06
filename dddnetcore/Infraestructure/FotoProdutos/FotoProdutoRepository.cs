using dddnetcore.Domain.FotoProdutos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.FotoProdutos
{
    public class FotoProdutoRepository : BaseRepository<FotoProduto, FotoProdutoId>, IFotoProdutosRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public FotoProdutoRepository(DDDSample1DbContext context) : base(context.FotoProdutos)
        {
            _context = context;
        }

        public async Task<List<FotoProduto>> GetFotoProdutoAsync(Guid? fotoProdutoId = null)
        {
            var query = _context.FotoProdutos.AsQueryable();

            if (fotoProdutoId.HasValue)
            {
                query = query.Where(c => c.Id.AsGuid() == fotoProdutoId.Value);
            }

            return await query.ToListAsync();
        }
        public async Task<FotoProduto> UpdateAsync(FotoProduto fotoProduto)
        {
            _context.FotoProdutos.Update(fotoProduto);
            await _context.SaveChangesAsync();
            return fotoProduto;
        }
    }
}