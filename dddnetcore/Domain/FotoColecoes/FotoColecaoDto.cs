using dddnetcore.Domain.FotoColecoes;

namespace dddnetcore.Domain.FotoColecoes
{
    public class FotoColecaoDto
    {
        public Guid Id { get; set; }
        public string UrlColecao { get; private set; } 

        public Guid ColecaoId { get; private set; }

        public FotoColecaoDto() { }

        public FotoColecaoDto(FotoColecao fotoColecao)
        {
            this.Id = fotoColecao.Id.AsGuid();
            this.UrlColecao = fotoColecao.UrlColecao.Url;
            this.ColecaoId = fotoColecao.ColecaoId.AsGuid();
        }
    }
}