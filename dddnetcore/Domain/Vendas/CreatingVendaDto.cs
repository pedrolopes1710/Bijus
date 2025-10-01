namespace dddnetcore.Domain.Vendas
{
    public class CreatingVendaDto
    {
        public DateTime Data { get; set; }
        public string Estado { get; set; }
        public double Total { get; set; }
        public Guid ClienteId { get; set; }
    }
}