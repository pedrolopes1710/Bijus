using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoProdutos
{
    public interface IFotoProdutosRepository : IRepository<FotoProduto, FotoProdutoId>
    {
        //public Task<List<Orcamento>> GetOrcamentosAsync(Guid? rubricaId = null);
        Task<FotoProduto> UpdateAsync(FotoProduto fotoProduto);
    }
}