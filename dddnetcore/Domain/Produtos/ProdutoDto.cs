using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;

namespace dddnetcore.Domain.Produtos
{
    public class ProdutoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Preco { get; set; }
        public int Stock { get; set; } 
        public CategoriaDto Categoria{ get; set; }
        public List<FotoProdutoDto> Fotos { get; set; }
        public ProdutoDto() { }

        public ProdutoDto(Produto produto)
        {
            this.Id = produto.Id.AsGuid();
            this.Nome = produto.NomeProduto.Nome;
            this.Descricao = produto.DescricaoProduto.Nome;
            this.Preco = produto.PrecoProduto.Preco;
            this.Stock = produto.StockProduto.Stock;
            this.Categoria = produto.Categoria != null ? new CategoriaDto(produto.Categoria) : new CategoriaDto();
            this.Fotos = produto.FotoProduto != null ? produto.FotoProduto.ConvertAll(foto => new FotoProdutoDto(foto)) : new List<FotoProdutoDto>();
        }
    }
}