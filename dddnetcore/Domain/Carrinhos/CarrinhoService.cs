using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.ItensCarrinho;

namespace dddnetcore.Domain.Carrinhos
{
    public class CarrinhoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICarrinhoRepository _repo;
        private readonly IClienteRepository _clienteRepo;
        private readonly IItemCarrinhoRepository _itemCarrinhoRepo;

        public CarrinhoService(IUnitOfWork unitOfWork, ICarrinhoRepository repo, IClienteRepository clienteRepo,IItemCarrinhoRepository itemCarrinhoRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._clienteRepo = clienteRepo;
            this._itemCarrinhoRepo = itemCarrinhoRepo;
        }

        public async Task<List<CarrinhoDto>> GetAllAsync(Guid? clienteId = null) {
            if (clienteId != null) {
                return (await this._repo.GetCarrinhoAsync(clienteId)).ConvertAll(carrinho => new CarrinhoDto(carrinho));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(carrinho => new CarrinhoDto(carrinho));
        }
        public async Task<CarrinhoDto> GetByIdAsync(CarrinhoId id)
        {
            var carrinho = await this._repo.GetByIdAsync(id);
            return carrinho == null ? null : new CarrinhoDto(carrinho);
        }

        public async Task<CarrinhoDto> AddAsync(CreatingCarrinhoDto dto)
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
        }


       public async Task<CarrinhoDto> UpdateAsync(CarrinhoDto dto)
        {
            var carrinho = await this._repo.GetByIdAsync(new CarrinhoId(dto.Id));

            if (carrinho == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new CarrinhoDto(carrinho);
        }

        public async Task<CarrinhoDto> DeleteAsync(CarrinhoId id)
        {
            var carrinho = await this._repo.GetByIdAsync(id);

            if (carrinho == null)
                return null;

            this._repo.Remove(carrinho);
            await this._unitOfWork.CommitAsync();

            return new CarrinhoDto(carrinho);
        }
    }
}