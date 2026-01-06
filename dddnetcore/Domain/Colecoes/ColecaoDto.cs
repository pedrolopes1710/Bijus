using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.Colecoes
{
    public class ColecaoDto
    {
        public Guid Id { get; set; }
        public DateTime DataAtualizacao { get; set; }
        public DateTime DataCriacao { get; set; }
        public string EstadoColecao { get; set; }
        public string NomeColecao { get; set; }
        public string DescricaoColecao { get; set; }    
        public List<ProdutoDto> Produto { get; set; }
        public List<FotoColecaoDto> Fotos { get; set; }

        public ColecaoDto() { }

        public ColecaoDto(Colecao colecao)
        {
            this.Id = colecao.Id.AsGuid();
            this.DataAtualizacao = colecao.DataAtualizacaoColecao.Data;
            this.DataCriacao = colecao.DataCriacaoColecao.Data;
            this.EstadoColecao = colecao.EstadoColecao.ToString();
            this.NomeColecao = colecao.NomeColecao.Nome;
            this.DescricaoColecao = colecao.DescricaoColecao.Nome;
            this.Produto = colecao.Produto != null ? colecao.Produto.ConvertAll(prod => new ProdutoDto(prod)) : new List<ProdutoDto>();
            this.Fotos = colecao.FotoColecao != null ? colecao.FotoColecao.ConvertAll(foto => new FotoColecaoDto(foto)) : new List<FotoColecaoDto>();
        }
    }
}