using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using Microsoft.AspNetCore.Hosting;

namespace dddnetcore.Domain.FotoProdutos
{
    public class FotoProdutoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFotoProdutosRepository _repo;
        private readonly IWebHostEnvironment _env;

        public FotoProdutoService(IUnitOfWork unitOfWork, IFotoProdutosRepository repo, IWebHostEnvironment env)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._env = env;
        }

        public async Task<List<FotoProdutoDto>> GetAllAsync(Guid? produtoId = null)
        {
            if (produtoId != null)
            {
                return (await this._repo.GetFotoProdutoAsync(produtoId)).ConvertAll(fotoProduto => new FotoProdutoDto(fotoProduto));
            }

            return (await this._repo.GetAllAsync()).ConvertAll(fotoProduto => new FotoProdutoDto(fotoProduto));
        }

        public async Task<FotoProdutoDto> GetByIdAsync(FotoProdutoId id)
        {
            var fotoProduto = await this._repo.GetByIdAsync(id);
            return fotoProduto == null ? null : new FotoProdutoDto(fotoProduto);
        }

        public async Task<FotoProdutoDto> AddUploadAsync(CreatingFotoProdutoUploadDto dto)
        {
            var url = await SaveImageAsync(dto.Foto);
            var fotoProduto = new FotoProduto(new UrlProduto(url), new ProdutoId(dto.ProdutoId));

            await this._repo.AddAsync(fotoProduto);
            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }

        public async Task<FotoProdutoDto> UpdateAsync(FotoProdutoDto dto)
        {
            var fotoProduto = await this._repo.GetByIdAsync(new FotoProdutoId(dto.Id));

            if (fotoProduto == null)
                return null;

            fotoProduto.AtualizarDados(new UrlProduto(dto.UrlProduto), new ProdutoId(dto.ProdutoId));

            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }

        public async Task<FotoProdutoDto> ReplaceUploadAsync(FotoProdutoId id, Guid produtoId, IFormFile foto)
        {
            var fotoProduto = await this._repo.GetByIdAsync(id);

            if (fotoProduto == null)
                return null;

            var nextUrl = fotoProduto.UrlProduto.Url;

            if (foto != null && foto.Length > 0)
            {
                nextUrl = await SaveImageAsync(foto);
                DeleteLocalImage(fotoProduto.UrlProduto.Url);
            }

            fotoProduto.AtualizarDados(new UrlProduto(nextUrl), new ProdutoId(produtoId));

            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }

        public async Task<FotoProdutoDto> DeleteAsync(FotoProdutoId id)
        {
            var fotoProduto = await this._repo.GetByIdAsync(id);

            if (fotoProduto == null)
                return null;

            this._repo.Remove(fotoProduto);
            DeleteLocalImage(fotoProduto.UrlProduto.Url);
            await this._unitOfWork.CommitAsync();

            return new FotoProdutoDto(fotoProduto);
        }

        private async Task<string> SaveImageAsync(IFormFile foto)
        {
            if (foto == null || foto.Length == 0)
                throw new BusinessRuleValidationException("A imagem e obrigatoria.");

            if (!string.IsNullOrWhiteSpace(foto.ContentType) && !foto.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                throw new BusinessRuleValidationException("O ficheiro tem de ser uma imagem.");

            var extension = Path.GetExtension(foto.FileName);
            if (string.IsNullOrWhiteSpace(extension))
                extension = ".jpg";

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(GetWebRootPath(), "uploads", "produtos");

            Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await foto.CopyToAsync(stream);

            return $"/uploads/produtos/{fileName}";
        }

        private void DeleteLocalImage(string url)
        {
            if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("/uploads/produtos/", StringComparison.OrdinalIgnoreCase))
                return;

            var fileName = Path.GetFileName(url);
            var filePath = Path.Combine(GetWebRootPath(), "uploads", "produtos", fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        private string GetWebRootPath()
        {
            return _env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot");
        }
    }
}
