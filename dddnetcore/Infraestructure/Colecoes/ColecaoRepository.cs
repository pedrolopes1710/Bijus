using dddnetcore.Domain.Colecoes;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.Colecoes
{
    public class ColecaoRepository : BaseRepository<Colecao, ColecaoId>, IColecaoRepository
    {
        private readonly DDDSample1DbContext _context;

        public ColecaoRepository(DDDSample1DbContext context) : base(context.Set<Colecao>())
        {
            _context = context;
        }

        public async Task<Colecao> UpdateAsync(Colecao colecao)
        {
            _context.Set<Colecao>().Update(colecao);
            await _context.SaveChangesAsync();
            return colecao;
        }

        public new async Task<List<Colecao>> GetAllAsync()
        {
            return await _context.Set<Colecao>()
                .Include(c => c.FotoColecao)
                .Include(c => c.Produto)
                .ToListAsync();
        }
    }
}
