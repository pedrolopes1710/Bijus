using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.GruposVariantes
{
    public class GrupoVariantesId : EntityId
    {
        [JsonConstructor]
        public GrupoVariantesId(Guid value) : base(value) { }
        public GrupoVariantesId(string value) : base(value) { }
        protected override object createFromString(string text) => new Guid(text);
        public override string AsString() => AsGuid().ToString();
        public Guid AsGuid() => (Guid)ObjValue;
    }
}
