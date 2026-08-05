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

        public async Task<List<FotoProduto>> GetFotoProdutoAsync(Guid? produtoId = null)
        {
            var query = _context.FotoProdutos.AsQueryable();

            if (produtoId.HasValue)
            {
                var produtoVo = new dddnetcore.Domain.Produtos.ProdutoId(produtoId.Value);
                query = query.Where(c => c.ProdutoId.Equals(produtoVo));
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
