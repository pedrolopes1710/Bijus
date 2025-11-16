using System;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Carrinhos;


namespace dddnetcore.Domain.ItensCarrinho
{
    public class ItemCarrinho : Entity<ItemCarrinhoId>,IAggregateRoot
    {
        public Produto Produto { get; private set; }
        public Quantidade Quantidade { get; private set; }
        public CarrinhoId CarrinhoId { get; private set; }

        private ItemCarrinho() { }

        public ItemCarrinho(
            Produto produto,
            Quantidade quantidade)
        {

            if (produto == null)
                throw new BusinessRuleValidationException("Produto cannot be null.");
            if (quantidade == null)
                throw new BusinessRuleValidationException("Quantidade cannot be null.");

            this.Id = new ItemCarrinhoId(Guid.NewGuid());
            this.Produto = produto;
            this.Quantidade = quantidade;
        }
         public void SetCarrinhoId(CarrinhoId carrinhoId)
        {
            if (carrinhoId == null)
                throw new BusinessRuleValidationException("ItemCarrinhoId não pode ser nulo.");
            this.CarrinhoId = carrinhoId;
        }
    }
}
