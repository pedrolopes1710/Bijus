using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Carrinhos
{
    public class DataCriacaoCarrinho : IValueObject
    {
        public DateTime Data {get; private set;}

        public DataCriacaoCarrinho(DateTime datacriacaocarrinho) {
            if(string.IsNullOrEmpty(datacriacaocarrinho.ToString()))
                throw new BusinessRuleValidationException("The date cannot be null or empty!");
            this.Data = datacriacaocarrinho;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DataCriacaoCarrinho)obj;
            return Data == other.Data;
        }

        public override int GetHashCode(){
            return Data.GetHashCode();
        }
    }
}