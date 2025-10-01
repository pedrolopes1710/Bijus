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

        public VendaDto() { }

        public VendaDto(Venda venda)
        {
            this.Id = venda.Id.AsGuid();
            this.VendaData = venda.VendaData.Data;
            this.VendaEstado = venda.VendaEstado.ToString();
            this.VendaTotal = venda.VendaTotal.Total;
            this.Cliente = new ClienteDto(venda.Cliente);
        }
    }
}