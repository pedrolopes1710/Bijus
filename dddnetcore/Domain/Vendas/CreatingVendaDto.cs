namespace dddnetcore.Domain.Vendas
{
    public class CreatingVendaDto
    {
        public DateTime Data { get; set; }
        public string Estado { get; set; }
        public double Total { get; set; }
        public Guid ClienteId { get; set; }
        public string? Transportadora { get; set; }
        public string? CodigoRastreio { get; set; }
        public string? UrlRastreio { get; set; }
        public DateTime? DataEnvio { get; set; }
        public string? NotasInternas { get; set; }
    }
}
