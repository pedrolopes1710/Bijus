using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;

namespace dddnetcore.Domain.GruposVariantes
{
    public class GrupoVariantesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGrupoVariantesRepository _repo;

        public GrupoVariantesService(IUnitOfWork unitOfWork, IGrupoVariantesRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<List<GrupoVariantesDto>> GetAllAsync() =>
            (await _repo.GetAllDetalhadoAsync()).ConvertAll(item => new GrupoVariantesDto(item));

        public async Task<GrupoVariantesDto> GetByIdAsync(GrupoVariantesId id)
        {
            var item = await _repo.GetDetalhadoAsync(id);
            return item == null ? null : new GrupoVariantesDto(item);
        }

        public async Task<GrupoVariantesDto> AddAsync(CreatingGrupoVariantesDto dto)
        {
            var item = new GrupoVariantes(dto.Nome);
            item.SubstituirConfiguracao(dto.Opcoes, dto.Variantes);
            await _repo.AddAsync(item);
            await _unitOfWork.CommitAsync();
            return new GrupoVariantesDto(item);
        }

        public async Task<GrupoVariantesDto> UpdateAsync(GrupoVariantesDto dto)
        {
            var item = await _repo.GetDetalhadoAsync(new GrupoVariantesId(dto.Id));
            if (item == null) return null;
            item.Atualizar(dto.Nome, dto.Opcoes, dto.Variantes);
            await _unitOfWork.CommitAsync();
            return new GrupoVariantesDto(item);
        }

        public async Task<GrupoVariantesDto> DeleteAsync(GrupoVariantesId id)
        {
            var item = await _repo.GetDetalhadoAsync(id);
            if (item == null) return null;
            var resultado = new GrupoVariantesDto(item);
            _repo.Remove(item);
            await _unitOfWork.CommitAsync();
            return resultado;
        }
    }
}
