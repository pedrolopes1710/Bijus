using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Colecoes
{
    public class DescricaoColecao : IValueObject
    {
        public String Nome {get; private set;}

        public DescricaoColecao(String nome) {
            if(string.IsNullOrEmpty(nome))
                throw new BusinessRuleValidationException("A descrição não pode ser nula ou inexistente!");
            this.Nome = nome;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DescricaoColecao)obj;
            return Nome == other.Nome;
        }

        public override int GetHashCode(){
            return Nome.GetHashCode();
        }
    }
}