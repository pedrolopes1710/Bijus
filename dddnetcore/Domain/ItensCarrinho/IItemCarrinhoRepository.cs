
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.ItensCarrinho
{
    public interface IItemCarrinhoRepository : IRepository<ItemCarrinho, ItemCarrinhoId>
    {
        public Task<List<ItemCarrinho>> GetItemCarrinhoAsync(Guid? itemCarinhoId = null);
        public Task<ItemCarrinho> UpdateAsync(ItemCarrinho itemCarrinho);
        
    }
}