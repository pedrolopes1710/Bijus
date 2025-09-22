using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Produtos
{
    public class PrecoProduto : IValueObject
    {
        public int Preco {get; private set;}

        public PrecoProduto(int preco) {
            if (preco < 0)
            throw new BusinessRuleValidationException("O preço não pode ser negativo!");
            this.Preco = preco;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (PrecoProduto)obj;
            return Preco == other.Preco;
        }

        public override int GetHashCode(){
            return Preco.GetHashCode();
        }
    }
}