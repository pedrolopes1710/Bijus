using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using dddnetcore.Domain.GruposVariantes;
using Microsoft.EntityFrameworkCore;

namespace dddnetcore.Infraestructure.GruposVariantes
{
    public class GrupoVariantesRepository : BaseRepository<GrupoVariantes, GrupoVariantesId>, IGrupoVariantesRepository
    {
        private readonly DDDSample1DbContext _context;

        public GrupoVariantesRepository(DDDSample1DbContext context) : base(context.GruposVariantes)
        {
            _context = context;
        }

        private IQueryable<GrupoVariantes> Detalhado() => _context.GruposVariantes
            .Include(g => g.Opcoes).ThenInclude(o => o.Valores)
            .Include(g => g.Variantes).ThenInclude(v => v.Valores).ThenInclude(v => v.ValorOpcao).ThenInclude(v => v.Opcao);

        public Task<List<GrupoVariantes>> GetAllDetalhadoAsync() => Detalhado().AsSplitQuery().ToListAsync();

        public Task<GrupoVariantes?> GetDetalhadoAsync(GrupoVariantesId id) =>
            Detalhado().AsSplitQuery().FirstOrDefaultAsync(g => g.Id == id);
    }
}
