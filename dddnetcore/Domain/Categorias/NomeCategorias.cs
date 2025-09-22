using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Categorias
{
    public class NomeCategoria : IValueObject
    {
        public String Nome {get; private set;}

        public NomeCategoria(String nome) {
            if(string.IsNullOrEmpty(nome))
                throw new BusinessRuleValidationException("O nome não pode ser nulo ou inexistente!");
            this.Nome = nome;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (NomeCategoria)obj;
            return Nome == other.Nome;
        }

        public override int GetHashCode(){
            return Nome.GetHashCode();
        }
    }
}