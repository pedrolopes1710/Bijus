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
        public string? Transportadora { get; private set; }
        public string? CodigoRastreio { get; private set; }
        public string? UrlRastreio { get; private set; }
        public DateTime? DataEnvio { get; private set; }
        public string? NotasInternas { get; private set; }
        public string? MetodoPagamento { get; private set; }
        public string? PagamentoProvider { get; private set; }
        public string? PagamentoReferencia { get; private set; }
        public string? PagamentoEstado { get; private set; }
        
           
        private Venda() { }

        public Venda(
            VendaData vendaData,
            VendaEstado vendaEstado,
            VendaTotal vendaTotal,
            Cliente cliente,
            string? transportadora = null,
            string? codigoRastreio = null,
            string? urlRastreio = null,
            DateTime? dataEnvio = null,
            string? notasInternas = null
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
            this.Transportadora = transportadora;
            this.CodigoRastreio = codigoRastreio;
            this.UrlRastreio = urlRastreio;
            this.DataEnvio = dataEnvio;
            this.NotasInternas = notasInternas;
        }

        public void AtualizarEstado(VendaEstado estado)
        {
            this.VendaEstado = estado;
        }

        public void AtualizarDados(
            VendaData vendaData,
            VendaEstado estado,
            VendaTotal vendaTotal)
        {
            if (vendaData == null)
                throw new BusinessRuleValidationException("VendaData cannot be null.");

            if (vendaTotal == null)
                throw new BusinessRuleValidationException("VendaTotal cannot be null.");

            this.VendaData = vendaData;
            this.VendaEstado = estado;
            this.VendaTotal = vendaTotal;
        }

        public void AtualizarRastreio(
            string? transportadora,
            string? codigoRastreio,
            string? urlRastreio,
            DateTime? dataEnvio,
            string? notasInternas)
        {
            this.Transportadora = transportadora;
            this.CodigoRastreio = codigoRastreio;
            this.UrlRastreio = urlRastreio;
            this.DataEnvio = dataEnvio;
            this.NotasInternas = notasInternas;
        }

        public void PrepararPagamento(string metodo, string provider, string referencia, string estado, double total)
        {
            MetodoPagamento = metodo;
            PagamentoProvider = provider;
            PagamentoReferencia = referencia;
            PagamentoEstado = estado;
            VendaTotal = new VendaTotal(total);
        }

        public void AtualizarPagamento(string estado, bool pago)
        {
            PagamentoEstado = estado;
            if (pago) VendaEstado = VendaEstado.paga;
        }
    }
}
