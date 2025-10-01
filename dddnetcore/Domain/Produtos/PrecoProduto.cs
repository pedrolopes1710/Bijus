using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Produtos
{
    public class PrecoProduto : IValueObject
    {
        public double Preco {get; private set;}

        public PrecoProduto(double preco) {
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