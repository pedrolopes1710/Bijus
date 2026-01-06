using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Domain.Produtos;
using DDDSample1.Domain.Shared;


namespace dddnetcore.Domain.Colecoes
{
    public class Colecao : Entity<ColecaoId>, IAggregateRoot
    {
        public NomeColecao NomeColecao { get; private set; }
        public DescricaoColecao DescricaoColecao { get; private set; }
        public DataAtualizacaoColecao DataAtualizacaoColecao { get; private set; }
        public DataCriacaoColecao DataCriacaoColecao { get; private set; }
        public EstadoColecao EstadoColecao { get; private set; }
        public List<FotoColecao> FotoColecao { get; private set; }
        public List<Produto> Produto { get; private set; }
        private Colecao()
        {
        }
    public Colecao(
            NomeColecao nomeColecao,
            DescricaoColecao descricaoColecao,
            DataCriacaoColecao dataCriacaoColecao,
            DataAtualizacaoColecao dataAtualizacaoColecao,
            EstadoColecao estadoColecao
        )
        {
            if (nomeColecao == null)
                throw new BusinessRuleValidationException("NomeColecao cannot be null.");

            if (descricaoColecao == null)
                throw new BusinessRuleValidationException("DescricaoColecao cannot be null.");

            if (dataCriacaoColecao == null)
                throw new BusinessRuleValidationException("DataCriacaoColecao cannot be null.");

            if (dataAtualizacaoColecao == null)
                throw new BusinessRuleValidationException("DataAtualizacaoColecao cannot be null.");

            this.Id = new ColecaoId(Guid.NewGuid());
            this.NomeColecao = nomeColecao;
            this.DescricaoColecao = descricaoColecao;
            this.DataCriacaoColecao = dataCriacaoColecao;
            this.DataAtualizacaoColecao = dataAtualizacaoColecao;
            this.EstadoColecao = estadoColecao;
        }
    }
}