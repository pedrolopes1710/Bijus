using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.Vendas;

namespace dddnetcore.Domain.VendaProdutos
{
    public class VendaProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVendaProdutoRepository _repo;
        private readonly IVendaRepository _vendaRepo;
        private readonly IProdutoRepository _produtoRepo;

        public VendaProdutoService(
            IUnitOfWork unitOfWork, 
            IVendaProdutoRepository repo,
            IVendaRepository vendaRepo,
            IProdutoRepository produtoRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._vendaRepo = vendaRepo;
            this._produtoRepo = produtoRepo;
        }

        public async Task<List<VendaProdutoDto>> GetAllAsync(Guid? vendaId = null)
        {
            if (vendaId != null)
            {
                return (await this._repo.GetVendaProdutosByVendaAsync(vendaId))
                    .ConvertAll(vp => new VendaProdutoDto(vp));
            }
            return (await this._repo.GetAllAsync())
                .ConvertAll(vp => new VendaProdutoDto(vp));
        }

        public async Task<VendaProdutoDto> GetByIdAsync(VendaProdutoId id)
        {
            var vendaProduto = await this._repo.GetByIdAsync(id);
            return vendaProduto == null ? null : new VendaProdutoDto(vendaProduto);
        }

        public async Task<VendaProdutoDto> AddAsync(CreatingVendaProdutoDto dto)
        {
            var venda = await this._vendaRepo.GetByIdAsync(new VendaId(dto.VendaId));
            var produto = await this._produtoRepo.GetByIdAsync(new ProdutoId(dto.ProdutoId));

            var vendaProduto = new VendaProduto(
                venda,
                produto,
                new Quantidade(dto.Quantidade),
                new PrecoUnitario(dto.PrecoUnitario)
            );

            await this._repo.AddAsync(vendaProduto);
            await this._unitOfWork.CommitAsync();

            return new VendaProdutoDto(vendaProduto);
        }

        public async Task<VendaProdutoDto> DeleteAsync(VendaProdutoId id)
        {
            var vendaProduto = await this._repo.GetByIdAsync(id);

            if (vendaProduto == null)
                return null;

            this._repo.Remove(vendaProduto);
            await this._unitOfWork.CommitAsync();

            return new VendaProdutoDto(vendaProduto);
        }
    }
}