using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Colecoes
{
    public interface IColecaoRepository : IRepository<Colecao, ColecaoId>
    {
        //public Task<List<Colecao>> GetColecoesAsync(Guid? categoriaId = null);
        Task<Colecao> UpdateAsync(Colecao colecao);
    }
}