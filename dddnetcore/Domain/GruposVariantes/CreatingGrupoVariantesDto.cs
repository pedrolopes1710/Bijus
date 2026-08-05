using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.GruposVariantes
{
    public class CreatingGrupoVariantesDto
    {
        public string Nome { get; set; }
        public List<ProdutoOpcaoDto> Opcoes { get; set; } = new();
        public List<ProdutoVarianteDto> Variantes { get; set; } = new();
    }
}
