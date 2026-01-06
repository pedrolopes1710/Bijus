using DDDSample1.Domain.Shared;


namespace dddnetcore.Domain.FotoProdutos
{
    public class FotoProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFotoProdutosRepository _repo;

        public FotoProdutoService(IUnitOfWork unitOfWork, IFotoProdutosRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<FotoProdutoDto>> GetAllAsync(Guid? produtoId = null) {
            if (produtoId != null) {
                return (await this._repo.GetFotoProdutoAsync(produtoId)).ConvertAll(fotoProduto => new FotoProdutoDto(fotoProduto));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(fotoProduto => new FotoProdutoDto(fotoProduto));
        }
        public async Task<FotoProdutoDto> GetByIdAsync(FotoProdutoId id)
        {
            var fotoProduto = await this._repo.GetByIdAsync(id);
            return fotoProduto == null ? null : new FotoProdutoDto(fotoProduto);
        }

        /*public async Task<CarrinhoDto> AddAsync(CreatingCarrinhoDto dto)
        {
            var cliente = await this._clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));

            var carrinho = new Carrinho(
                cliente,
                new DataCriacaoCarrinho(dto.DataCriacao),
                new DataUltimaAtualizacaoCarrinho(dto.DataAtualizacao)
            );

            // Guarda primeiro o carrinho
            await this._repo.AddAsync(carrinho);
            await this._unitOfWork.CommitAsync();

            // Agora associa os itens (já existe FK válida)
            if (dto.Items != null)
            {
                foreach (var itemCarrinhoId in dto.Items)
                {
                    var itemCarrinho = await _itemCarrinhoRepo.GetByIdAsync(new ItemCarrinhoId(itemCarrinhoId));
                    if (itemCarrinho != null)
                    {
                        itemCarrinho.SetCarrinhoId(carrinho.Id);
                        await _itemCarrinhoRepo.UpdateAsync(itemCarrinho);
                    }
                }

                await _unitOfWork.CommitAsync();
            }

            return new CarrinhoDto(carrinho);
        }*/


       public async Task<FotoProdutoDto> UpdateAsync(FotoProdutoDto dto)
        {
            var fotoProduto = await this._repo.GetByIdAsync(new FotoProdutoId(dto.Id));

            if (fotoProduto == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }

        public async Task<FotoProdutoDto> DeleteAsync(FotoProdutoId id)
        {
            var fotoProduto = await this._repo.GetByIdAsync(id);

            if (fotoProduto == null)
                return null;

            this._repo.Remove(fotoProduto);
            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }
    }
}