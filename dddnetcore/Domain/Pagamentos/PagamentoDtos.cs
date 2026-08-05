namespace dddnetcore.Domain.Pagamentos
{
    public class CriarCheckoutMbWayDto
    {
        public Guid VendaId { get; set; }
    }

    public class CheckoutMbWayDto
    {
        public Guid VendaId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class EstadoPagamentoDto
    {
        public Guid VendaId { get; set; }
        public string Estado { get; set; } = string.Empty;
        public bool Pago { get; set; }
    }
}
