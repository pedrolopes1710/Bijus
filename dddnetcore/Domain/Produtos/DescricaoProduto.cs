using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Produtos
{
    public class DescricaoProduto : IValueObject
    {
        public String Nome {get; private set;}

        public DescricaoProduto(String nome) {
            if(string.IsNullOrEmpty(nome))
                throw new BusinessRuleValidationException("A descrição não pode ser nula ou inexistente!");
            this.Nome = nome;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DescricaoProduto)obj;
            return Nome == other.Nome;
        }

        public override int GetHashCode(){
            return Nome.GetHashCode();
        }
    }
}