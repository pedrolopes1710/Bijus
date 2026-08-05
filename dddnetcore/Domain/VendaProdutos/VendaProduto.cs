using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Vendas;

namespace dddnetcore.Domain.VendaProdutos
{
    public class VendaProduto : Entity<VendaProdutoId>, IAggregateRoot
    {
        public Venda Venda { get; private set; }
        public Produto Produto { get; private set; }
        public Quantidade Quantidade { get; private set; }
        public PrecoUnitario PrecoUnitario { get; private set; }
        public string? DetalhesVariante { get; private set; }

        private VendaProduto() { }

        public VendaProduto(Venda venda, Produto produto, Quantidade quantidade, PrecoUnitario precoUnitario, string? detalhesVariante = null)
        {
            Validar(venda, produto, quantidade, precoUnitario);
            Id = new VendaProdutoId(Guid.NewGuid());
            Venda = venda;
            Produto = produto;
            Quantidade = quantidade;
            PrecoUnitario = precoUnitario;
            DetalhesVariante = detalhesVariante;
        }

        public decimal CalcularSubtotal() => Quantidade.Value * PrecoUnitario.Value;

        public void AtualizarDados(Venda venda, Produto produto, Quantidade quantidade, PrecoUnitario precoUnitario, string? detalhesVariante = null)
        {
            Validar(venda, produto, quantidade, precoUnitario);
            Venda = venda;
            Produto = produto;
            Quantidade = quantidade;
            PrecoUnitario = precoUnitario;
            DetalhesVariante = detalhesVariante;
        }

        private static void Validar(Venda venda, Produto produto, Quantidade quantidade, PrecoUnitario precoUnitario)
        {
            if (venda == null) throw new BusinessRuleValidationException("Venda cannot be null.");
            if (produto == null) throw new BusinessRuleValidationException("Produto cannot be null.");
            if (quantidade == null) throw new BusinessRuleValidationException("Quantidade cannot be null.");
            if (precoUnitario == null) throw new BusinessRuleValidationException("PrecoUnitario cannot be null.");
        }
    }
}
