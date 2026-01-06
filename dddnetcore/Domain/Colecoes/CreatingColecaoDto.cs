
namespace dddnetcore.Domain.Colecoes
{
    public class CreatingColecaoDto
    {
        public Guid Id { get; set; }
        public DateTime DataAtualizacao { get; set; }
        public DateTime DataCriacao { get; set; }
        public string EstadoColecao { get; set; }
        public string NomeColecao { get; set; }
        public string DescricaoColecao { get; set; }
        public List<Guid> Produtos { get; set; }
        public List<IFormFile> Fotos { get; set; }
    }
}
