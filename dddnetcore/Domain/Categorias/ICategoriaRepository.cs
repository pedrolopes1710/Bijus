using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;

namespace dddnetcore.Domain.Categorias
{
    public interface ICategoriaRepository : IRepository<Categoria, CategoriaId>
    {
        //public Task<List<Orcamento>> GetOrcamentosAsync(Guid? rubricaId = null);
        Task<Categoria> UpdateAsync(Categoria categoria);
    }
}