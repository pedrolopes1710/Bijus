namespace dddnetcore.Domain.VendaProdutos
{
    public class CreatingVendaProdutoDto
    {
        public Guid VendaId { get; set; }
        public Guid ProdutoId { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
    }
}