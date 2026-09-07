using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Vendas
{
    public class VendaDto
    {
        public Guid Id { get; set; }
        public DateTime VendaData { get; set; }
        public string VendaEstado { get; set; }
        public double VendaTotal { get; set; }
        public ClienteDto Cliente { get; set; }
        public string? Transportadora { get; set; }
        public string? CodigoRastreio { get; set; }
        public string? UrlRastreio { get; set; }
        public DateTime? DataEnvio { get; set; }
        public string? NotasInternas { get; set; }
        public string? MetodoPagamento { get; set; }
        public string? PagamentoProvider { get; set; }
        public string? PagamentoReferencia { get; set; }
        public string? PagamentoEstado { get; set; }

        public VendaDto() { }

        public VendaDto(Venda venda)
        {
            this.Id = venda.Id.AsGuid();
            this.VendaData = venda.VendaData.Data;
            this.VendaEstado = venda.VendaEstado.ToString();
            this.VendaTotal = venda.VendaTotal.Total;
            this.Cliente = venda.Cliente != null ? new ClienteDto(venda.Cliente) : null;
            this.Transportadora = venda.Transportadora;
            this.CodigoRastreio = venda.CodigoRastreio;
            this.UrlRastreio = venda.UrlRastreio;
            this.DataEnvio = venda.DataEnvio;
            this.NotasInternas = venda.NotasInternas;
            this.MetodoPagamento = venda.MetodoPagamento;
            this.PagamentoProvider = venda.PagamentoProvider;
            this.PagamentoReferencia = venda.PagamentoReferencia;
            this.PagamentoEstado = venda.PagamentoEstado;
        }
    }
}
