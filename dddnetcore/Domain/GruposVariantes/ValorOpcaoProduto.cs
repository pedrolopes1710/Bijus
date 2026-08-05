using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.GruposVariantes
{
    public class ValorOpcaoProduto
    {
        public Guid Id { get; private set; }
        public OpcaoProduto Opcao { get; private set; }
        public string Valor { get; private set; }
        public string? CorHex { get; private set; }
        public int Ordem { get; private set; }

        private ValorOpcaoProduto() { }

        internal ValorOpcaoProduto(OpcaoProduto opcao, string valor, string? corHex, int ordem, Guid? id = null)
        {
            Id = id.HasValue && id != Guid.Empty ? id.Value : Guid.NewGuid();
            Opcao = opcao;
            Atualizar(valor, corHex, ordem);
        }

        internal void Atualizar(string valor, string? corHex, int ordem)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new BusinessRuleValidationException("O valor da caracteristica e obrigatorio.");
            Valor = valor.Trim();
            CorHex = string.IsNullOrWhiteSpace(corHex) ? null : corHex.Trim();
            Ordem = ordem;
        }
    }
}
