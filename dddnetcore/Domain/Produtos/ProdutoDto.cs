using System;
using dddnetcore.Domain.Categorias;

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

        public ProdutoDto() { }

        public ProdutoDto(Produto produto)
        {
            this.Id = produto.Id.AsGuid();
            this.Nome = produto.NomeProduto.Nome;
            this.Descricao = produto.DescricaoProduto.Nome;
            this.Preco = produto.PrecoProduto.Preco;
            this.Stock = produto.StockProduto.Stock;
            this.Categoria = new CategoriaDto(produto.Categoria);
        }
    }
}