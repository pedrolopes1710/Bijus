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

        public VendaProdutoService(IUnitOfWork unitOfWork, IVendaProdutoRepository repo, IVendaRepository vendaRepo, IProdutoRepository produtoRepo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _vendaRepo = vendaRepo;
            _produtoRepo = produtoRepo;
        }

        public async Task<List<VendaProdutoDto>> GetAllAsync(Guid? vendaId = null)
        {
            var items = vendaId != null
                ? await _repo.GetVendaProdutosByVendaAsync(vendaId)
                : await _repo.GetAllAsync();
            return items.ConvertAll(item => new VendaProdutoDto(item));
        }

        public async Task<VendaProdutoDto> GetByIdAsync(VendaProdutoId id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? null : new VendaProdutoDto(item);
        }

        public async Task<VendaProdutoDto> AddAsync(CreatingVendaProdutoDto dto)
        {
            var venda = await _vendaRepo.GetByIdAsync(new VendaId(dto.VendaId));
            var produto = await _produtoRepo.GetByIdAsync(new ProdutoId(dto.ProdutoId));
            var item = new VendaProduto(venda, produto, new Quantidade(dto.Quantidade), new PrecoUnitario(dto.PrecoUnitario), dto.DetalhesVariante);
            await _repo.AddAsync(item);
            await _unitOfWork.CommitAsync();
            return new VendaProdutoDto(item);
        }

        public async Task<VendaProdutoDto> DeleteAsync(VendaProdutoId id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return null;
            _repo.Remove(item);
            await _unitOfWork.CommitAsync();
            return new VendaProdutoDto(item);
        }

        public async Task<VendaProdutoDto> UpdateAsync(VendaProdutoDto dto)
        {
            var item = await _repo.GetByIdAsync(new VendaProdutoId(dto.Id));
            if (item == null) return null;
            var venda = await _vendaRepo.GetByIdAsync(new VendaId(dto.VendaId));
            var produto = await _produtoRepo.GetByIdAsync(new ProdutoId(dto.ProdutoId));
            item.AtualizarDados(venda, produto, new Quantidade(dto.Quantidade), new PrecoUnitario(dto.PrecoUnitario), dto.DetalhesVariante);
            await _unitOfWork.CommitAsync();
            return new VendaProdutoDto(item);
        }
    }
}
