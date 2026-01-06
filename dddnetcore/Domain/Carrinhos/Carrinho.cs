using System;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Vendas;
using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.ItensCarrinho;

namespace dddnetcore.Domain.Carrinhos
{
    public class Carrinho : Entity<CarrinhoId>,IAggregateRoot
    {
        public Cliente Cliente { get; private set; }
        public DataCriacaoCarrinho DataCriacao { get; private set; }   
        public DataUltimaAtualizacaoCarrinho DataAtualizacao { get; private set; }
        public List<ItemCarrinho> Itens { get; private set; }
        
        private Carrinho() { }

        public Carrinho(
            Cliente cliente,
            DataCriacaoCarrinho dataCriacao,
            DataUltimaAtualizacaoCarrinho dataAtualizacao
            )
        {
            if (cliente == null)
                throw new BusinessRuleValidationException("Cliente cannot be null.");
            if (dataCriacao == null)
                throw new BusinessRuleValidationException("Data cannot be null.");
            if (dataAtualizacao == null)
                throw new BusinessRuleValidationException("Data cannot be null.");


            this.Id = new CarrinhoId(Guid.NewGuid());
            this.Cliente = cliente;
            this.DataCriacao = dataCriacao;
            this.DataAtualizacao = dataAtualizacao;
    
        }
    }
}
