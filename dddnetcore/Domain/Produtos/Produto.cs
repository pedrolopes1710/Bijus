using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;

namespace dddnetcore.Domain.Produtos
{
    public class Produto : Entity<ProdutoId>, IAggregateRoot
    {
        public NomeProduto NomeProduto { get; private set; }
        public DescricaoProduto DescricaoProduto {get; private set;}
        public PrecoProduto PrecoProduto {get; private set;}
        public StockProduto StockProduto {get; private set;}
        public Categoria Categoria {get; private set;}
           
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

    }
}