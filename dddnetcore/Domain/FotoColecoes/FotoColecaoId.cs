using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.FotoColecoes
{
    public class FotoColecaoId : EntityId
    {
        
        [JsonConstructor]
        public FotoColecaoId(Guid value) : base(value)
        {
        }
        
        public FotoColecaoId(String value):base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }
        
        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}