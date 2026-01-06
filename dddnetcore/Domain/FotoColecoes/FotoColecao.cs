using dddnetcore.Domain.Colecoes;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoColecoes
{
    public class FotoColecao : Entity<FotoColecaoId>, IAggregateRoot
    {
        
        public UrlColecao UrlColecao { get; private set; } 

        public ColecaoId ColecaoId { get; private set; }
        private FotoColecao() { }

        public FotoColecao(
            UrlColecao urlColecao,
            ColecaoId colecaoId
        )
        
        {
            if (urlColecao == null)
                throw new BusinessRuleValidationException("UrlColecao cannot be null.");            

            this.Id = new FotoColecaoId(Guid.NewGuid());
            this.UrlColecao = urlColecao;
            this.ColecaoId = colecaoId;
        }
    }
}
