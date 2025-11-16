using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Carrinhos
{
    public interface ICarrinhoRepository : IRepository<Carrinho, CarrinhoId>
    {
        public Task<List<Carrinho>> GetCarrinhoAsync(Guid? carrinhoId = null);
        Task<Carrinho> UpdateAsync(Carrinho carrinho);
    }
}