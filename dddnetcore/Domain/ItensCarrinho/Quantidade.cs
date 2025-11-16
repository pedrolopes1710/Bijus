using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.ItensCarrinho
{
    public class Quantidade : IValueObject
    {
        public int Value { get; private set; }

        private Quantidade() { }

        public Quantidade(int value)
        {
            if (value <= 0)
                throw new BusinessRuleValidationException("Quantidade deve ser maior que zero.");

            Value = value;
        }

       public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (Quantidade)obj;
            return Value == other.Value;
        }

        public override int GetHashCode(){
            return Value.GetHashCode();
        }
    }
}
