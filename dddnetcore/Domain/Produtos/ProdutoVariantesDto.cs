namespace dddnetcore.Domain.Produtos
{
    public class ProdutoOpcaoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public List<ProdutoOpcaoValorDto> Valores { get; set; } = new();
    }

    public class ProdutoOpcaoValorDto
    {
        public Guid Id { get; set; }
        public string Valor { get; set; } = string.Empty;
        public string? CorHex { get; set; }
    }

    public class ProdutoVarianteDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Sku { get; set; } = string.Empty;
        public Dictionary<string, string> Valores { get; set; } = new();
        public double? Preco { get; set; }
        public int Stock { get; set; }
        public bool Ativa { get; set; } = true;
    }

    public class ProdutoConfiguracaoDto
    {
        public List<ProdutoOpcaoDto> Opcoes { get; set; } = new();
        public List<ProdutoVarianteDto> Variantes { get; set; } = new();
    }
}
