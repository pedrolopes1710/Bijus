using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.GruposVariantes
{
    public class GrupoVariantesDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public List<ProdutoOpcaoDto> Opcoes { get; set; } = new();
        public List<ProdutoVarianteDto> Variantes { get; set; } = new();

        public GrupoVariantesDto() { }

        public GrupoVariantesDto(GrupoVariantes grupo)
        {
            Id = grupo.Id.AsGuid();
            Nome = grupo.Nome;
            Opcoes = grupo.Opcoes.OrderBy(o => o.Ordem).Select(opcao => new ProdutoOpcaoDto
            {
                Id = opcao.Id,
                Nome = opcao.Nome,
                Valores = opcao.Valores.OrderBy(v => v.Ordem).Select(valor => new ProdutoOpcaoValorDto
                {
                    Id = valor.Id,
                    Valor = valor.Valor,
                    CorHex = valor.CorHex
                }).ToList()
            }).ToList();
            Variantes = grupo.Variantes.OrderBy(v => v.Ordem).Select(variante => new ProdutoVarianteDto
            {
                Id = variante.Id,
                Sku = variante.Sku,
                Preco = variante.Preco,
                Stock = variante.Stock,
                Ativa = variante.Ativa,
                Valores = variante.Valores.ToDictionary(
                    selecao => selecao.ValorOpcao.Opcao.Nome,
                    selecao => selecao.ValorOpcao.Valor)
            }).ToList();
        }
    }
}
