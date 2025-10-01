using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Produtos
{
    public interface IProdutoRepository : IRepository<Produto, ProdutoId>
    {
        public Task<List<Produto>> GetProdutosAsync(Guid? categoriaId = null);
        Task<Produto> UpdateAsync(Produto produto);
    }
}