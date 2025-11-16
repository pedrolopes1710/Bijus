using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.VendaProdutos
{
    public class PrecoUnitario : IValueObject
    {
        public decimal Value { get; private set; }

        private PrecoUnitario() { }

        public PrecoUnitario(decimal value)
        {
            if (value < 0)
                throw new BusinessRuleValidationException("Preço unitário não pode ser negativo.");

            Value = value;
        }

        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (PrecoUnitario)obj;
            return Value == other.Value;
        }

        public override int GetHashCode(){
            return Value.GetHashCode();
        }
    }
}
