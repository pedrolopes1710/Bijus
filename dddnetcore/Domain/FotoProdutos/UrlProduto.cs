using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoProdutos
{
    public class UrlProduto : IValueObject
    {
        public String Url {get; private set;}

        public UrlProduto(String url) {
            if(string.IsNullOrEmpty(url))
                throw new BusinessRuleValidationException("O URL não pode ser nulo ou inexistente!");
            this.Url = url;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (UrlProduto)obj;
            return Url == other.Url;
        }

        public override int GetHashCode(){
            return Url.GetHashCode();
        }
    }
}