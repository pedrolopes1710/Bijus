using dddnetcore.Domain.FotoProdutos;

namespace dddnetcore.Domain.FotoProdutos
{
    public class FotoProdutoDto
    {
        public Guid Id { get; set; }
        public string UrlProduto { get; private set; } 

        public Guid ProdutoId { get; private set; }

        public FotoProdutoDto() { }

        public FotoProdutoDto(FotoProduto fotoProduto)
        {
            this.Id = fotoProduto.Id.AsGuid();
            this.UrlProduto = fotoProduto.UrlProduto.Url;
            this.ProdutoId = fotoProduto.ProdutoId.AsGuid();
        }
    }
}