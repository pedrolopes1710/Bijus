using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.GruposVariantes
{
    public interface IGrupoVariantesRepository : IRepository<GrupoVariantes, GrupoVariantesId>
    {
        Task<List<GrupoVariantes>> GetAllDetalhadoAsync();
        Task<GrupoVariantes?> GetDetalhadoAsync(GrupoVariantesId id);
    }
}
