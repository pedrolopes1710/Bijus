using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public class MoradaCliente : IValueObject
    {
        public String Morada {get; private set;}

        public MoradaCliente(String morada) {
            if(string.IsNullOrEmpty(morada))
                throw new BusinessRuleValidationException("A morada não pode ser nulo ou inexistente!");
            this.Morada = morada;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (MoradaCliente)obj;
            return Morada == other.Morada;
        }

        public override int GetHashCode(){
            return Morada.GetHashCode();
        }
    }
}