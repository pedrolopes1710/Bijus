using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.Produtos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.Produtos
{
    public class ProdutoRepository : BaseRepository<Produto, ProdutoId>, IProdutoRepository
    {
        private readonly DDDSample1DbContext _context;

        public ProdutoRepository(DDDSample1DbContext context) : base(context.Produtos)
        {
            _context = context;
        }
        public async Task<List<Produto>> GetProdutosAsync(Guid? categoriaId = null)
        {
            if (categoriaId == null) return await GetAllAsync();

            var query = _context.Produtos.AsQueryable();

            query = query.Where(produto => produto.Categoria.Id.Equals(new CategoriaId(categoriaId.Value)))
                .Include(o => o.Categoria);

            return await query.ToListAsync();
        }
        public async Task<Produto> UpdateAsync(Produto produto)
        {
            _context.Produtos.Update(produto);
            await _context.SaveChangesAsync();
            return produto;
        }
        public new async Task<List<Produto>> GetAllAsync() {
            return await _context.Produtos
                .Include(o => o.Categoria)
                .Include(o=> o.FotoProduto)
                .ToListAsync();
        }
    }
}