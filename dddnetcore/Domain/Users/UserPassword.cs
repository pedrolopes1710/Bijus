using DDDSample1.Domain.Shared;
using BCrypt.Net;

namespace dddnetcore.Domain.Users
{
    public class UserPassword : IValueObject
    {
        public string Password { get; private set; }

        // Construtor público — para criar nova senha (faz hash)
        public UserPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new BusinessRuleValidationException("O password não pode ser nulo ou inexistente!");
            
            if (password.Length < 6)
                throw new BusinessRuleValidationException("O password deve ter pelo menos 6 caracteres!");
            
            // Hash da senha com BCrypt
            this.Password = BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Construtor privado — para desserializar da BD (sem fazer hash novamente)
        private UserPassword() { }

        public bool VerifyPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            try
            {
                return BCrypt.Net.BCrypt.Verify(password, this.Password);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao verificar: {ex.Message}");
                return false;
            }
        }
        
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (UserPassword)obj;
            return Password == other.Password;
        }

        public override int GetHashCode()
        {
            return Password.GetHashCode();
        }
    }
}