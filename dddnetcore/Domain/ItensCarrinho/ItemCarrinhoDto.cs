namespace dddnetcore.Domain.ItensCarrinho
{
    public class ItemCarrinhoDto
    {
        public Guid Id { get; set; }
        public Guid ProdutoId { get; set; }
        public int Quantidade { get; set; }

        public ItemCarrinhoDto() { }

        public ItemCarrinhoDto(ItemCarrinho itemCarrinho)
        {
            this.Id = itemCarrinho.Id.AsGuid();
            this.ProdutoId = itemCarrinho.Produto.Id.AsGuid();
            this.Quantidade = itemCarrinho.Quantidade.Value;
            
        }
    }
}