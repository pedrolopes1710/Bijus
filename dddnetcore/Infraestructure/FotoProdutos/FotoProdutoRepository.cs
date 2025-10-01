using dddnetcore.Domain.FotoProdutos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;

namespace dddnetcore.Infraestructure.FotoProdutos
{
    public class FotoProdutoRepository : BaseRepository<FotoProduto, FotoProdutoId>, IFotoProdutosRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public FotoProdutoRepository(DDDSample1DbContext context) : base(context.FotoProdutos)
        {
            _context = context;
        }

        public async Task<FotoProduto> UpdateAsync(FotoProduto fotoProduto)
        {
            _context.FotoProdutos.Update(fotoProduto);
            await _context.SaveChangesAsync();
            return fotoProduto;
        }
    }
}