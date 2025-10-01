using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public class NomeCliente : IValueObject
    {
        public String Nome {get; private set;}

        public NomeCliente(String nome) {
            if(string.IsNullOrEmpty(nome))
                throw new BusinessRuleValidationException("O nome não pode ser nulo ou inexistente!");
            this.Nome = nome;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (NomeCliente)obj;
            return Nome == other.Nome;
        }

        public override int GetHashCode(){
            return Nome.GetHashCode();
        }
    }
}