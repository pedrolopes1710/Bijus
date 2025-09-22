using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.FotoProdutos;

namespace dddnetcore.Domain.FotoProdutos
{
    public interface IFotoProdutosRepository : IRepository<FotoProduto, FotoProdutoId>
    {
        //public Task<List<Orcamento>> GetOrcamentosAsync(Guid? rubricaId = null);
        Task<FotoProduto> UpdateAsync(FotoProduto fotoProduto);
    }
}