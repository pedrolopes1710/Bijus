using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.Colecoes;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Domain.GruposVariantes;

namespace dddnetcore.Domain.Produtos
{
    public class Produto : Entity<ProdutoId>, IAggregateRoot
    {
        public NomeProduto NomeProduto { get; private set; }
        public DescricaoProduto DescricaoProduto {get; private set;}
        public PrecoProduto PrecoProduto {get; private set;}
        public StockProduto StockProduto {get; private set;}
        public Categoria Categoria { get; private set; }
        public List<FotoProduto> FotoProduto { get; private set; }
        public ColecaoId ColecaoId { get; private set; }
        public GrupoVariantes? GrupoVariantes { get; private set; }
        private Produto() { }

        public Produto(
            NomeProduto nomeProduto,
            DescricaoProduto descricaoProduto,
            PrecoProduto precoProduto,
            StockProduto stockProduto,
            Categoria categoria
            )
        {
            if (nomeProduto == null)
            throw new BusinessRuleValidationException("NomeProduto cannot be null.");

            if (descricaoProduto == null)
            throw new BusinessRuleValidationException("DescricaoProduto cannot be null.");

            if (precoProduto == null)
            throw new BusinessRuleValidationException("PrecoProduto cannot be null.");

            if (stockProduto == null)
            throw new BusinessRuleValidationException("StockProduto cannot be null.");

            this.Id = new ProdutoId(Guid.NewGuid());
            this.NomeProduto = nomeProduto;
            this.DescricaoProduto = descricaoProduto;
            this.PrecoProduto = precoProduto;
            this.StockProduto = stockProduto;
            this.Categoria = categoria;
        }
        public void SetColecaoId(ColecaoId colecaoId)
        {
            if (colecaoId == null)
                throw new BusinessRuleValidationException("ColecaoId não pode ser nulo.");
            this.ColecaoId = colecaoId;
        }

        public void AtualizarDados(
            NomeProduto nomeProduto,
            DescricaoProduto descricaoProduto,
            PrecoProduto precoProduto,
            StockProduto stockProduto,
            Categoria categoria)
        {
            if (nomeProduto == null)
                throw new BusinessRuleValidationException("NomeProduto cannot be null.");

            if (descricaoProduto == null)
                throw new BusinessRuleValidationException("DescricaoProduto cannot be null.");

            if (precoProduto == null)
                throw new BusinessRuleValidationException("PrecoProduto cannot be null.");

            if (stockProduto == null)
                throw new BusinessRuleValidationException("StockProduto cannot be null.");

            if (categoria == null)
                throw new BusinessRuleValidationException("Categoria cannot be null.");

            this.NomeProduto = nomeProduto;
            this.DescricaoProduto = descricaoProduto;
            this.PrecoProduto = precoProduto;
            this.StockProduto = stockProduto;
            this.Categoria = categoria;
        }

        public void DefinirGrupoVariantes(GrupoVariantes? grupoVariantes)
        {
            GrupoVariantes = grupoVariantes;
        }
    }
}
