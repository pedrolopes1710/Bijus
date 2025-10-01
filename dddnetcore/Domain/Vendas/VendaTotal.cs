using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Vendas
{
    public class VendaTotal : IValueObject
    {
        public double Total {get; private set;}

        public VendaTotal(double total) {
            if (total < 0)
            throw new BusinessRuleValidationException("O total não pode ser negativo!");
            this.Total = total;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (VendaTotal)obj;
            return Total == other.Total;
        }

        public override int GetHashCode(){
            return Total.GetHashCode();
        }
    }
}