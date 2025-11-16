using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Users
{
    public class UserPassword : IValueObject
    {
        public String Password{get; private set;}

        public UserPassword(String password) {
            if(string.IsNullOrEmpty(password))
                throw new BusinessRuleValidationException("O password não pode ser nulo ou inexistente!");
            this.Password = password;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (UserPassword)obj;
            return Password == other.Password;
        }

        public override int GetHashCode(){
            return Password.GetHashCode();
        }
    }
}