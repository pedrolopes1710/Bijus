using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Vendas;

namespace dddnetcore.Domain.ItensCarrinho
{
    public class ItemCarrinhoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IItemCarrinhoRepository _repo;
        private readonly IProdutoRepository _produtoRepo;

        public ItemCarrinhoService(
            IUnitOfWork unitOfWork, 
            IItemCarrinhoRepository repo,
            IProdutoRepository produtoRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._produtoRepo = produtoRepo;
        }

        public async Task<List<ItemCarrinhoDto>> GetAllAsync(Guid? itemCarrinhoId = null)
        {
            if (itemCarrinhoId != null)
            {
                return (await this._repo.GetItemCarrinhoAsync(itemCarrinhoId))
                    .ConvertAll(itemCarrinho => new ItemCarrinhoDto(itemCarrinho));
            }
            return (await this._repo.GetAllAsync())
                .ConvertAll(itemCarrinho => new ItemCarrinhoDto(itemCarrinho));
        }

        public async Task<ItemCarrinhoDto> GetByIdAsync(ItemCarrinhoId id)
        {
            var itemCarrinho = await this._repo.GetByIdAsync(id);
            return itemCarrinho == null ? null : new ItemCarrinhoDto(itemCarrinho);
        }

        public async Task<ItemCarrinhoDto> AddAsync(CreatingItemCarrinhoDto dto)
        {
            var produto = await this._produtoRepo.GetByIdAsync(new ProdutoId(dto.ProdutoId));

            var itemCarrinho = new ItemCarrinho(
                produto,
                new Quantidade(dto.Quantidade)
            );

            await this._repo.AddAsync(itemCarrinho);
            await this._unitOfWork.CommitAsync();

            return new ItemCarrinhoDto(itemCarrinho);
        }

        public async Task<ItemCarrinhoDto> DeleteAsync(ItemCarrinhoId id)
        {
            var itemCarrinho = await this._repo.GetByIdAsync(id);

            if (itemCarrinho == null)
                return null;

            this._repo.Remove(itemCarrinho);
            await this._unitOfWork.CommitAsync();

            return new ItemCarrinhoDto(itemCarrinho);
        }
        public async Task<ItemCarrinhoDto> UpdateAsync(ItemCarrinhoDto dto)
        {
            var itemCarrinho = await this._repo.GetByIdAsync(new ItemCarrinhoId(dto.Id));

            if (itemCarrinho == null)
                return null;

            
            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new ItemCarrinhoDto(itemCarrinho);
        }
    }
}