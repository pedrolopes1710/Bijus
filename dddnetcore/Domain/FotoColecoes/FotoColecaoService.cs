using DDDSample1.Domain.Shared;


namespace dddnetcore.Domain.FotoColecoes
{
    public class FotoColecaoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFotoColecaoRepository _repo;

        public FotoColecaoService(IUnitOfWork unitOfWork, IFotoColecaoRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<FotoColecaoDto>> GetAllAsync() {
            return (await this._repo.GetAllAsync()).ConvertAll(fotoColecao => new FotoColecaoDto(fotoColecao));
        }
        public async Task<FotoColecaoDto> GetByIdAsync(FotoColecaoId id)
        {
            var fotoColecao = await this._repo.GetByIdAsync(id);
            return fotoColecao == null ? null : new FotoColecaoDto(fotoColecao);
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


       public async Task<FotoColecaoDto> UpdateAsync(FotoColecaoDto dto)
        {
            var fotoColecao = await this._repo.GetByIdAsync(new FotoColecaoId(dto.Id));

            if (fotoColecao == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
        }

        public async Task<FotoColecaoDto> DeleteAsync(FotoColecaoId id)
        {
            var fotoColecao = await this._repo.GetByIdAsync(id);

            if (fotoColecao == null)
                return null;

            this._repo.Remove(fotoColecao);
            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
        }
    }
}