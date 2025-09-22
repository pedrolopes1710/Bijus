using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Produtos
{
    public class StockProduto : IValueObject
    {
        public int Stock {get; private set;}

        public StockProduto(int stock) {
            if (stock < 0)
            throw new BusinessRuleValidationException("O stock não pode ser negativo!");
            this.Stock = stock;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (StockProduto)obj;
            return Stock == other.Stock;
        }

        public override int GetHashCode(){
            return Stock.GetHashCode();
        }
    }
}