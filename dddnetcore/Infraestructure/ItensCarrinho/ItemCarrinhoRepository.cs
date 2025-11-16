using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Domain.VendaProdutos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.ItensCarrinho
{
    public class ItemCarrinhoRepository : BaseRepository<ItemCarrinho, ItemCarrinhoId>, IItemCarrinhoRepository
    {
        private readonly DDDSample1DbContext _context;

        public ItemCarrinhoRepository(DDDSample1DbContext context) : base(context.ItensCarrinho)
        {
            _context = context;
        }

        public new async Task<List<ItemCarrinho>> GetAllAsync()
        {
            return await _context.ItensCarrinho
                .Include(ic => ic.Produto) // Produto é uma entidade relacionada
                .ToListAsync();
        }

        public async Task<List<ItemCarrinho>> GetItemCarrinhoAsync(Guid? itemCarrinhoId = null)
        {
            if (itemCarrinhoId == null) return await GetAllAsync();

            var query = _context.ItensCarrinho.AsQueryable();

            query = query
                .Where(vp => vp.Id.AsGuid().Equals(itemCarrinhoId.Value))
                .Include(vp => vp.Produto); // Apenas o Produto deve ser incluído

            return await query.ToListAsync();
        }

        public async Task<ItemCarrinho> UpdateAsync(ItemCarrinho itemCarrinho) {
            _context.ItensCarrinho.Update(itemCarrinho);

            await _context.SaveChangesAsync();

            return itemCarrinho;
        }
    }
}