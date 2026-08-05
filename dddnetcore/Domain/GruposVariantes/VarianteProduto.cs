using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.GruposVariantes
{
    public class VarianteProduto
    {
        public Guid Id { get; private set; }
        public GrupoVariantes GrupoVariantes { get; private set; }
        public string Sku { get; private set; }
        public double? Preco { get; private set; }
        public int Stock { get; private set; }
        public bool Ativa { get; private set; }
        public int Ordem { get; private set; }
        public List<VarianteProdutoValor> Valores { get; private set; } = new();

        private VarianteProduto() { }

        internal VarianteProduto(GrupoVariantes grupo, Guid id, string? sku, double? preco, int stock, bool ativa, int ordem)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            GrupoVariantes = grupo;
            Atualizar(sku, preco, stock, ativa, ordem);
        }

        internal void Atualizar(string? sku, double? preco, int stock, bool ativa, int ordem)
        {
            if (preco < 0) throw new BusinessRuleValidationException("O preco da combinacao nao pode ser negativo.");
            if (stock < 0) throw new BusinessRuleValidationException("O stock da combinacao nao pode ser negativo.");
            Sku = sku?.Trim() ?? string.Empty;
            Preco = preco;
            Stock = stock;
            Ativa = ativa;
            Ordem = ordem;
        }

        internal void AdicionarValor(ValorOpcaoProduto valor) => Valores.Add(new VarianteProdutoValor(this, valor));

        internal void SincronizarValores(IEnumerable<ValorOpcaoProduto> valores)
        {
            var ids = valores.Select(v => v.Id).ToHashSet();
            Valores.RemoveAll(v => !ids.Contains(v.ValorOpcaoProdutoId));
            foreach (var valor in valores.Where(valor => Valores.All(v => v.ValorOpcaoProdutoId != valor.Id)))
                AdicionarValor(valor);
        }
    }
}
