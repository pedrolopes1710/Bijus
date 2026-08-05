using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Colecoes;
using Microsoft.AspNetCore.Hosting;

namespace dddnetcore.Domain.FotoColecoes
{
    public class FotoColecaoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFotoColecaoRepository _repo;
        private readonly IWebHostEnvironment _env;

        public FotoColecaoService(IUnitOfWork unitOfWork, IFotoColecaoRepository repo, IWebHostEnvironment env)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._env = env;
        }

        public async Task<List<FotoColecaoDto>> GetAllAsync()
        {
            return (await this._repo.GetAllAsync()).ConvertAll(fotoColecao => new FotoColecaoDto(fotoColecao));
        }

        public async Task<FotoColecaoDto> GetByIdAsync(FotoColecaoId id)
        {
            var fotoColecao = await this._repo.GetByIdAsync(id);
            return fotoColecao == null ? null : new FotoColecaoDto(fotoColecao);
        }

        public async Task<FotoColecaoDto> AddUploadAsync(CreatingFotoColecaoUploadDto dto)
        {
            var url = await SaveImageAsync(dto.Foto);
            var fotoColecao = new FotoColecao(new UrlColecao(url), new ColecaoId(dto.ColecaoId));

            await this._repo.AddAsync(fotoColecao);
            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
        }

        public async Task<FotoColecaoDto> UpdateAsync(FotoColecaoDto dto)
        {
            var fotoColecao = await this._repo.GetByIdAsync(new FotoColecaoId(dto.Id));

            if (fotoColecao == null)
                return null;

            fotoColecao.AtualizarDados(new UrlColecao(dto.UrlColecao), new ColecaoId(dto.ColecaoId));

            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
        }

        public async Task<FotoColecaoDto> ReplaceUploadAsync(FotoColecaoId id, Guid colecaoId, IFormFile foto)
        {
            var fotoColecao = await this._repo.GetByIdAsync(id);

            if (fotoColecao == null)
                return null;

            var nextUrl = fotoColecao.UrlColecao.Url;

            if (foto != null && foto.Length > 0)
            {
                nextUrl = await SaveImageAsync(foto);
                DeleteLocalImage(fotoColecao.UrlColecao.Url);
            }

            fotoColecao.AtualizarDados(new UrlColecao(nextUrl), new ColecaoId(colecaoId));

            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
        }

        public async Task<FotoColecaoDto> DeleteAsync(FotoColecaoId id)
        {
            var fotoColecao = await this._repo.GetByIdAsync(id);

            if (fotoColecao == null)
                return null;

            this._repo.Remove(fotoColecao);
            DeleteLocalImage(fotoColecao.UrlColecao.Url);
            await this._unitOfWork.CommitAsync();

            return new FotoColecaoDto(fotoColecao);
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
            var folderPath = Path.Combine(GetWebRootPath(), "uploads", "colecoes");

            Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await foto.CopyToAsync(stream);

            return $"/uploads/colecoes/{fileName}";
        }

        private void DeleteLocalImage(string url)
        {
            if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("/uploads/colecoes/", StringComparison.OrdinalIgnoreCase))
                return;

            var fileName = Path.GetFileName(url);
            var filePath = Path.Combine(GetWebRootPath(), "uploads", "colecoes", fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        private string GetWebRootPath()
        {
            return _env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot");
        }
    }
}
