using System;
using dddnetcore.Domain.Produtos;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoProdutos
{
    public class FotoProduto : Entity<FotoProdutoId>, IAggregateRoot
    {
        
        public UrlProduto UrlProduto { get; private set; } 

        public Produto Produto { get; private set; }
        private FotoProduto() { }

        public FotoProduto(
            UrlProduto urlProduto
        )
        
        {
            if (urlProduto == null)
                throw new BusinessRuleValidationException("UrlProduto cannot be null.");            

            this.Id = new FotoProdutoId(Guid.NewGuid());
            this.UrlProduto = urlProduto;
        }
    }
}
