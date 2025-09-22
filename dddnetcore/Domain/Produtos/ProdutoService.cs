using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;

namespace DDDSample1.Domain.Produtos
{
    public class ProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProdutoRepository _repo;

        public ProdutoService(IUnitOfWork unitOfWork, IProdutoRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        /*public async Task<List<ProdutoDto>> GetAllAsync()
        {
            return (await this._repo.GetAllAsync()).ConvertAll(produto => new ProdutoDto(produto));
        }

        public async Task<ProdutoDto> GetByIdAsync(ProdutoId id)
        {
            var produto = await this._repo.GetByIdAsync(id);
            return produto == null ? null : new ProdutoDto(produto);
        }

        public async Task<ProdutoDto> AddAsync(CreatingProdutoDto dto)
        {
            var produto = new Produto(
                new NomeProduto(dto.Nome),
                new DescricaoProduto(dto.Descricao),
                new PrecoProduto(dto.Preco),
                new CodigoProduto(dto.Codigo)
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

            produto.ChangeNome(new NomeProduto(dto.Nome));
            produto.ChangeDescricao(new DescricaoProduto(dto.Descricao));
            produto.ChangePreco(new PrecoProduto(dto.Preco));
            produto.ChangeCodigo(new CodigoProduto(dto.Codigo));

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
        }*/
    }
}