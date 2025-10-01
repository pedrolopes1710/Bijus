using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Categorias
{
    public interface ICategoriaRepository : IRepository<Categoria, CategoriaId>
    {
        //public Task<List<Orcamento>> GetOrcamentosAsync(Guid? rubricaId = null);
        Task<Categoria> UpdateAsync(Categoria categoria);
    }
}