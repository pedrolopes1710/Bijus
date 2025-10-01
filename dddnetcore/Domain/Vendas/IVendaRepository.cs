using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Vendas
{
    public interface IVendaRepository : IRepository<Venda, VendaId>
    {
        public Task<List<Venda>> GetVendasAsync(Guid? clienteId = null);
        Task<Venda> UpdateAsync(Venda venda);
    }
}