using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.Produtos
{
    public interface IProdutoRepository : IRepository<Produto, ProdutoId>
    {
        public Task<List<Produto>> GetProdutosAsync(Guid? categoriaId = null);
        Task<Produto> UpdateAsync(Produto produto);
    }
}