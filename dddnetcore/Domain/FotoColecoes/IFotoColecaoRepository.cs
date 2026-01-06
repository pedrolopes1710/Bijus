using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoColecoes
{
    public interface IFotoColecaoRepository : IRepository<FotoColecao, FotoColecaoId>
    {
        //public Task<List<FotoColecao>> GetFotoColecaoAsync(Guid? fotoColecaoId = null);
        Task<FotoColecao> UpdateAsync(FotoColecao fotoColecao);
    }
}