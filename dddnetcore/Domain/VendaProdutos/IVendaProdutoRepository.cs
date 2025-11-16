using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.VendaProdutos
{
    public interface IVendaProdutoRepository : IRepository<VendaProduto, VendaProdutoId>
    {
        Task<List<VendaProduto>> GetVendaProdutosByVendaAsync(Guid? vendaId);
    }
}