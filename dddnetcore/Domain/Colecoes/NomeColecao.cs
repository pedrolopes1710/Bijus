using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Colecoes
{
    public class NomeColecao : IValueObject
    {
        public String Nome {get; private set;}

        public NomeColecao(String nome) {
            if(string.IsNullOrEmpty(nome))
                throw new BusinessRuleValidationException("O nome não pode ser nulo ou inexistente!");
            this.Nome = nome;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (NomeColecao)obj;
            return Nome == other.Nome;
        }

        public override int GetHashCode(){
            return Nome.GetHashCode();
        }
    }
}