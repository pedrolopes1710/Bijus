using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Vendas
{
    public class Venda : Entity<VendaId>, IAggregateRoot
    {
        public VendaData VendaData { get; private set; }
        public VendaEstado VendaEstado { get; private set; }
        public VendaTotal VendaTotal { get; private set; }
        public Cliente Cliente { get; private set; }
        
           
        private Venda() { }

        public Venda(
            VendaData vendaData,
            VendaEstado vendaEstado,
            VendaTotal vendaTotal,
            Cliente cliente
            )
        {
            if (vendaData == null)
                throw new BusinessRuleValidationException("VendaData cannot be null.");

            if (vendaEstado == null)
                throw new BusinessRuleValidationException("VendaEstado cannot be null.");

            if (vendaTotal == null)
                throw new BusinessRuleValidationException("VendaTotal cannot be null.");

            if (cliente == null)
                throw new BusinessRuleValidationException("Cliente cannot be null.");

            this.Id = new VendaId(Guid.NewGuid());
            this.VendaData = vendaData;
            this.VendaEstado = vendaEstado;
            this.VendaTotal = vendaTotal;
            this.Cliente = cliente;
        }
    }
}