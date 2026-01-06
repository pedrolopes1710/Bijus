using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;
using Microsoft.AspNetCore.Hosting;

namespace dddnetcore.Domain.Produtos
{
    public class ProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProdutoRepository _repo;
        private readonly ICategoriaRepository _categoriaRepo;
        private readonly IFotoProdutosRepository _fotoProdutoRepo;
        private readonly IWebHostEnvironment _env;

        public ProdutoService(IUnitOfWork unitOfWork, IProdutoRepository repo, ICategoriaRepository categoriaRepo, IFotoProdutosRepository fotoProdutoRepo, IWebHostEnvironment env)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._categoriaRepo = categoriaRepo;
            this._fotoProdutoRepo = fotoProdutoRepo;
            this._env = env;
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

            // Guarda primeiro o carrinho
            await this._repo.AddAsync(produto);
            await this._unitOfWork.CommitAsync();

            if (dto.Fotos != null && dto.Fotos.Any())
            {
                foreach (var foto in dto.Fotos)
                {
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(foto.FileName)}";
                    var folderPath = Path.Combine(_env.WebRootPath, "uploads", "produtos");

                    Directory.CreateDirectory(folderPath);

                    var filePath = Path.Combine(folderPath, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await foto.CopyToAsync(stream);

                    var urlProduto = $"/uploads/produtos/{fileName}";
                    // 3️⃣ Criar registo FotoProduto
                    var fotoProduto = new FotoProduto
                    (
                        new UrlProduto(urlProduto), produto.Id
                    );

                    await _fotoProdutoRepo.AddAsync(fotoProduto);
                }

                await _unitOfWork.CommitAsync();
            }
            

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