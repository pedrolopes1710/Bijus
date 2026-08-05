namespace dddnetcore.Domain.GruposVariantes
{
    public class VarianteProdutoValor
    {
        public Guid VarianteProdutoId { get; private set; }
        public VarianteProduto Variante { get; private set; }
        public Guid ValorOpcaoProdutoId { get; private set; }
        public ValorOpcaoProduto ValorOpcao { get; private set; }

        private VarianteProdutoValor() { }

        internal VarianteProdutoValor(VarianteProduto variante, ValorOpcaoProduto valor)
        {
            Variante = variante;
            VarianteProdutoId = variante.Id;
            ValorOpcao = valor;
            ValorOpcaoProdutoId = valor.Id;
        }
    }
}
