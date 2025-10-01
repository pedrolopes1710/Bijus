using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public class EmailCliente : IValueObject
    {
        public String Email {get; private set;}

        public EmailCliente(String email) {
            if(string.IsNullOrEmpty(email))
                throw new BusinessRuleValidationException("O e-mail não pode ser nulo ou inexistente!");
            this.Email = email;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (EmailCliente)obj;
            return Email == other.Email;
        }

        public override int GetHashCode(){
            return Email.GetHashCode();
        }
    }
}