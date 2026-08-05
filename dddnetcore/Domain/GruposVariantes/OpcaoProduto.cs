using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.GruposVariantes
{
    public class OpcaoProduto
    {
        public Guid Id { get; private set; }
        public GrupoVariantes GrupoVariantes { get; private set; }
        public string Nome { get; private set; }
        public int Ordem { get; private set; }
        public List<ValorOpcaoProduto> Valores { get; private set; } = new();

        private OpcaoProduto() { }

        internal OpcaoProduto(GrupoVariantes grupo, string nome, int ordem, Guid? id = null)
        {
            Id = id.HasValue && id != Guid.Empty ? id.Value : Guid.NewGuid();
            GrupoVariantes = grupo;
            Atualizar(nome, ordem);
        }

        internal void Atualizar(string nome, int ordem)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new BusinessRuleValidationException("O nome da caracteristica e obrigatorio.");
            Nome = nome.Trim();
            Ordem = ordem;
        }

        internal ValorOpcaoProduto AdicionarValor(string valor, string? corHex, int ordem, Guid? id = null)
        {
            var item = new ValorOpcaoProduto(this, valor, corHex, ordem, id);
            Valores.Add(item);
            return item;
        }
    }
}
