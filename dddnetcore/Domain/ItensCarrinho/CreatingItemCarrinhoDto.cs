namespace dddnetcore.Domain.ItensCarrinho
{
    public class CreatingItemCarrinhoDto
    {
        public Guid ItemCarrinhoId { get; set; }
        public Guid ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }
}