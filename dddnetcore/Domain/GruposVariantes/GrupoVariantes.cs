using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.GruposVariantes
{
    public class GrupoVariantes : Entity<GrupoVariantesId>, IAggregateRoot
    {
        public string Nome { get; private set; }
        public List<OpcaoProduto> Opcoes { get; private set; } = new();
        public List<VarianteProduto> Variantes { get; private set; } = new();

        private GrupoVariantes() { }

        public GrupoVariantes(string nome)
        {
            Id = new GrupoVariantesId(Guid.NewGuid());
            AtualizarNome(nome);
        }

        public void Atualizar(string nome, List<ProdutoOpcaoDto>? opcoes, List<ProdutoVarianteDto>? variantes)
        {
            AtualizarNome(nome);
            SubstituirConfiguracao(opcoes, variantes);
        }

        private void AtualizarNome(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new BusinessRuleValidationException("O nome do grupo de variantes e obrigatorio.");
            Nome = nome.Trim();
        }

        public void SubstituirConfiguracao(List<ProdutoOpcaoDto>? opcoesDto, List<ProdutoVarianteDto>? variantesDto)
        {
            var opcoesRecebidas = opcoesDto ?? new();
            var variantesRecebidas = variantesDto ?? new();
            if (opcoesRecebidas.GroupBy(o => o.Nome.Trim(), StringComparer.OrdinalIgnoreCase).Any(g => g.Count() > 1))
                throw new BusinessRuleValidationException("Nao pode haver caracteristicas com o mesmo nome.");

            var valoresDisponiveis = new Dictionary<string, ValorOpcaoProduto>(StringComparer.OrdinalIgnoreCase);
            var opcoesMantidas = new HashSet<Guid>();

            for (var ordemOpcao = 0; ordemOpcao < opcoesRecebidas.Count; ordemOpcao++)
            {
                var opcaoDto = opcoesRecebidas[ordemOpcao];
                var opcao = opcaoDto.Id == Guid.Empty ? null : Opcoes.FirstOrDefault(o => o.Id == opcaoDto.Id);
                opcao ??= Opcoes.FirstOrDefault(o => o.Nome.Equals(opcaoDto.Nome.Trim(), StringComparison.OrdinalIgnoreCase));
                if (opcao == null)
                {
                    opcao = new OpcaoProduto(this, opcaoDto.Nome, ordemOpcao, opcaoDto.Id);
                    Opcoes.Add(opcao);
                }
                else
                {
                    opcao.Atualizar(opcaoDto.Nome, ordemOpcao);
                }
                opcoesMantidas.Add(opcao.Id);
                var valores = opcaoDto.Valores ?? new();
                if (valores.GroupBy(v => v.Valor.Trim(), StringComparer.OrdinalIgnoreCase).Any(g => g.Count() > 1))
                    throw new BusinessRuleValidationException($"A caracteristica '{opcao.Nome}' tem valores repetidos.");

                var valoresMantidos = new HashSet<Guid>();
                for (var ordemValor = 0; ordemValor < valores.Count; ordemValor++)
                {
                    var valorDto = valores[ordemValor];
                    var valor = valorDto.Id == Guid.Empty ? null : opcao.Valores.FirstOrDefault(v => v.Id == valorDto.Id);
                    valor ??= opcao.Valores.FirstOrDefault(v => v.Valor.Equals(valorDto.Valor.Trim(), StringComparison.OrdinalIgnoreCase));
                    if (valor == null)
                        valor = opcao.AdicionarValor(valorDto.Valor, valorDto.CorHex, ordemValor, valorDto.Id);
                    else
                        valor.Atualizar(valorDto.Valor, valorDto.CorHex, ordemValor);
                    valoresMantidos.Add(valor.Id);
                    valoresDisponiveis[$"{opcao.Nome}\u001f{valor.Valor}"] = valor;
                }

                opcao.Valores.RemoveAll(valor => !valoresMantidos.Contains(valor.Id));
            }

            var variantesMantidas = new HashSet<Guid>();
            for (var ordemVariante = 0; ordemVariante < variantesRecebidas.Count; ordemVariante++)
            {
                var varianteDto = variantesRecebidas[ordemVariante];
                var variante = varianteDto.Id == Guid.Empty ? null : Variantes.FirstOrDefault(v => v.Id == varianteDto.Id);
                if (variante == null)
                {
                    variante = new VarianteProduto(this, varianteDto.Id, varianteDto.Sku, varianteDto.Preco, varianteDto.Stock, varianteDto.Ativa, ordemVariante);
                    Variantes.Add(variante);
                }
                else
                {
                    variante.Atualizar(varianteDto.Sku, varianteDto.Preco, varianteDto.Stock, varianteDto.Ativa, ordemVariante);
                }
                variantesMantidas.Add(variante.Id);
                var valoresSelecionados = new List<ValorOpcaoProduto>();
                foreach (var selecao in varianteDto.Valores ?? new())
                {
                    if (!valoresDisponiveis.TryGetValue($"{selecao.Key}\u001f{selecao.Value}", out var valor))
                        throw new BusinessRuleValidationException($"A combinacao usa o valor '{selecao.Value}', que ja nao existe em '{selecao.Key}'.");
                    valoresSelecionados.Add(valor);
                }
                variante.SincronizarValores(valoresSelecionados);
            }

            Variantes.RemoveAll(variante => !variantesMantidas.Contains(variante.Id));
            Opcoes.RemoveAll(opcao => !opcoesMantidas.Contains(opcao.Id));
        }
    }
}
