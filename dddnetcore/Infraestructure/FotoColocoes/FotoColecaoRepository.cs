using dddnetcore.Domain.FotoColecoes;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.FotoColecoes
{
    public class FotoColecaoRepository : BaseRepository<FotoColecao, FotoColecaoId>, IFotoColecaoRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public FotoColecaoRepository(DDDSample1DbContext context) : base(context.FotoColecoes)
        {
            _context = context;
        }

        /*public async Task<List<FotoColecao>> GetFotoColecaoAsync(Guid? FotoColecaoId = null)
        {
            var query = _context.FotoColecoes.AsQueryable();

            if (FotoColecaoId.HasValue)
            {
                query = query.Where(c => c.Id.AsGuid() == FotoColecaoId.Value);
            }

            return await query.ToListAsync();
        }*/
        public async Task<FotoColecao> UpdateAsync(FotoColecao fotoColecao)
        {
            _context.FotoColecoes.Update(fotoColecao);
            await _context.SaveChangesAsync();
            return fotoColecao;
        }
    }
}