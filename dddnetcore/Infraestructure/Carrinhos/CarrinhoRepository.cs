using dddnetcore.Domain.Carrinhos;
using dddnetcore.Domain.Categorias;

using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.Carrinhos
{
    public class CarrinhoRepository : BaseRepository<Carrinho, CarrinhoId>, ICarrinhoRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public CarrinhoRepository(DDDSample1DbContext context) : base(context.Carrinhos)
        {
            _context = context;
        }
        public async Task<List<Carrinho>> GetCarrinhoAsync(Guid? carrinhoId = null)
        {
            var query = _context.Carrinhos.AsQueryable();

            if (carrinhoId.HasValue)
            {
                query = query.Where(c => c.Id.AsGuid() == carrinhoId.Value);
            }

            return await query.ToListAsync();
        }
        public async Task<Carrinho> UpdateAsync(Carrinho carrinho)
        {
            _context.Carrinhos.Update(carrinho);
            await _context.SaveChangesAsync();
            return carrinho;
        }
    }
}