using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoProdutos
{
    public interface IFotoProdutosRepository : IRepository<FotoProduto, FotoProdutoId>
    {
        public Task<List<FotoProduto>> GetFotoProdutoAsync(Guid? fotoProdutoId = null);
        Task<FotoProduto> UpdateAsync(FotoProduto fotoProduto);
    }
}