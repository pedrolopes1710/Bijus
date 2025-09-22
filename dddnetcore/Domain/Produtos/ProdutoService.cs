using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;

namespace dddnetcore.Domain.Produtos
{
    public class ProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProdutoRepository _repo;
        private readonly ICategoriaRepository _categoriaRepo;

        public ProdutoService(IUnitOfWork unitOfWork, IProdutoRepository repo, ICategoriaRepository categoriaRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._categoriaRepo = categoriaRepo;
        }

        public async Task<List<ProdutoDto>> GetAllAsync(Guid? categoriaId = null) {
            if (categoriaId != null) {
                return (await this._repo.GetProdutosAsync(categoriaId)).ConvertAll(produto => new ProdutoDto(produto));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(produto => new ProdutoDto(produto));
        }
        public async Task<ProdutoDto> GetByIdAsync(ProdutoId id)
        {
            var produto = await this._repo.GetByIdAsync(id);
            return produto == null ? null : new ProdutoDto(produto);
        }

        public async Task<ProdutoDto> AddAsync(CreatingProdutoDto dto)
        {
            var categoria = await this._categoriaRepo.GetByIdAsync(new CategoriaId(dto.CategoriaId));
            var produto = new Produto(
                new NomeProduto(dto.Nome),
                new DescricaoProduto(dto.Descricao),
                new PrecoProduto(dto.Preco),
                new StockProduto(dto.Stock),
                categoria
            );

            await this._repo.AddAsync(produto);
            await this._unitOfWork.CommitAsync();

            return new ProdutoDto(produto);
        }

       public async Task<ProdutoDto> UpdateAsync(ProdutoDto dto)
        {
            var produto = await this._repo.GetByIdAsync(new ProdutoId(dto.Id));

            if (produto == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new ProdutoDto(produto);
        }

        public async Task<ProdutoDto> DeleteAsync(ProdutoId id)
        {
            var produto = await this._repo.GetByIdAsync(id);

            if (produto == null)
                return null;

            this._repo.Remove(produto);
            await this._unitOfWork.CommitAsync();

            return new ProdutoDto(produto);
        }
    }
}