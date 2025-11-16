using System;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Vendas;

namespace dddnetcore.Domain.VendaProdutos
{
    public class VendaProduto : Entity<VendaProdutoId>,IAggregateRoot
    {
        public Venda Venda { get; private set; }
        public Produto Produto { get; private set; }
        public Quantidade Quantidade { get; private set; }
        public PrecoUnitario PrecoUnitario { get; private set; }


        private VendaProduto() { }

        public VendaProduto(
            Venda venda,
            Produto produto,
            Quantidade quantidade,
            PrecoUnitario precoUnitario)
        {
            if (venda == null)
                throw new BusinessRuleValidationException("Venda cannot be null.");
            if (produto == null)
                throw new BusinessRuleValidationException("Produto cannot be null.");
            if (quantidade == null)
                throw new BusinessRuleValidationException("Quantidade cannot be null.");
            if (precoUnitario == null)
                throw new BusinessRuleValidationException("PrecoUnitario cannot be null.");

            this.Id = new VendaProdutoId(Guid.NewGuid());
            this.Venda = venda;
            this.Produto = produto;
            this.Quantidade = quantidade;
            this.PrecoUnitario = precoUnitario;
        }

        public decimal CalcularSubtotal()
        {
            return Quantidade.Value * PrecoUnitario.Value;
        }
    }
}
