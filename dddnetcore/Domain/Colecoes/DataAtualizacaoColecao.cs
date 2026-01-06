using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Colecoes
{
    public class DataAtualizacaoColecao : IValueObject
    {
        public DateTime Data {get; private set;}

        public DataAtualizacaoColecao(DateTime data) {
            if (data == default(DateTime))
            throw new BusinessRuleValidationException("A data não pode ser inválida!");
            this.Data = data;
        }
        
        public override bool Equals(object obj) {
            if (obj == null || GetType() != obj.GetType())
                return false;

            var other = (DataAtualizacaoColecao)obj;
            return Data == other.Data;
        }

        public override int GetHashCode(){
            return Data.GetHashCode();
        }
    }
}