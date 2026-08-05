using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Domain.GruposVariantes;

namespace dddnetcore.Domain.Produtos
{
    public class ProdutoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Preco { get; set; }
        public int Stock { get; set; }
        public CategoriaDto Categoria { get; set; }
        public List<FotoProdutoDto> Fotos { get; set; }
        public List<ProdutoOpcaoDto> Opcoes { get; set; } = new();
        public List<ProdutoVarianteDto> Variantes { get; set; } = new();
        public Guid? GrupoVariantesId { get; set; }
        public GrupoVariantesDto? GrupoVariantes { get; set; }
        public ProdutoDto() { }

        public ProdutoDto(Produto produto)
        {
            Id = produto.Id.AsGuid();
            Nome = produto.NomeProduto.Nome;
            Descricao = produto.DescricaoProduto.Nome;
            Preco = produto.PrecoProduto.Preco;
            Stock = produto.StockProduto.Stock;
            Categoria = produto.Categoria != null ? new CategoriaDto(produto.Categoria) : new CategoriaDto();
            Fotos = produto.FotoProduto?.ConvertAll(foto => new FotoProdutoDto(foto)) ?? new();
            GrupoVariantes = produto.GrupoVariantes == null ? null : new GrupoVariantesDto(produto.GrupoVariantes);
            GrupoVariantesId = GrupoVariantes?.Id;
            Opcoes = GrupoVariantes?.Opcoes ?? new();
            Variantes = GrupoVariantes?.Variantes ?? new();
        }
    }
}
