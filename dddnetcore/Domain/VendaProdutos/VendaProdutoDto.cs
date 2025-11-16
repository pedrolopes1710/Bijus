namespace dddnetcore.Domain.VendaProdutos
{
    public class VendaProdutoDto
    {
        public Guid Id { get; set; }
        public Guid VendaId { get; set; }
        public Guid ProdutoId { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }

        public VendaProdutoDto() { }

        public VendaProdutoDto(VendaProduto vendaProduto)
        {
            this.Id = vendaProduto.Id.AsGuid();
            this.VendaId = vendaProduto.Venda.Id.AsGuid();
            this.ProdutoId = vendaProduto.Produto.Id.AsGuid();
            this.Quantidade = vendaProduto.Quantidade.Value;
            this.PrecoUnitario = vendaProduto.PrecoUnitario.Value;
        }
    }
}