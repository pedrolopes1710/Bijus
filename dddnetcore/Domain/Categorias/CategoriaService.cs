using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Categorias
{
    public class CategoriaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICategoriaRepository _repo;

        public CategoriaService(IUnitOfWork unitOfWork, ICategoriaRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<CategoriaDto>> GetAllAsync()
        {
            return (await this._repo.GetAllAsync()).ConvertAll(categoria => new CategoriaDto(categoria));
        }

        public async Task<CategoriaDto> GetByIdAsync(CategoriaId id)
        {
            var categoria = await this._repo.GetByIdAsync(id);
            return categoria == null ? null : new CategoriaDto(categoria);
        }

        public async Task<CategoriaDto> AddAsync(CreatingCategoriaDto dto)
        {
            var categoria = new Categoria(
                new NomeCategoria(dto.Nome)
            );

            await this._repo.AddAsync(categoria);
            await this._unitOfWork.CommitAsync();

            return new CategoriaDto(categoria);
        }

        public async Task<CategoriaDto> UpdateAsync(CategoriaDto dto)
        {
            var categoria = await this._repo.GetByIdAsync(new CategoriaId(dto.Id));

            if (categoria == null)
                return null;

            categoria.ChangeNomeCategoria(new NomeCategoria(dto.Nome));

            await this._unitOfWork.CommitAsync();

            return new CategoriaDto(categoria);
        }

        public async Task<CategoriaDto> DeleteAsync(CategoriaId id)
        {
            var categoria = await this._repo.GetByIdAsync(id);

            if (categoria == null)
                return null;

            this._repo.Remove(categoria);
            await this._unitOfWork.CommitAsync();

            return new CategoriaDto(categoria);
        }
    }
}