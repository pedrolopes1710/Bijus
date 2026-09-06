using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Vendas
{
    public class VendaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVendaRepository _repo;
        private readonly IClienteRepository _clienteRepo;

        public VendaService(IUnitOfWork unitOfWork, IVendaRepository repo, IClienteRepository clienteRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._clienteRepo = clienteRepo;
        }

        public async Task<List<VendaDto>> GetAllAsync(Guid? clienteId = null) {
            if (clienteId != null) {
                return (await this._repo.GetVendasAsync(clienteId)).ConvertAll(venda => new VendaDto(venda));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(venda => new VendaDto(venda));
        }
        public async Task<VendaDto> GetByIdAsync(VendaId id)
        {
            var venda = await this._repo.GetByIdAsync(id);
            return venda == null ? null : new VendaDto(venda);
        }

        public async Task<bool> PertenceAoClienteAsync(Guid vendaId, Guid clienteId)
        {
            var venda = await _repo.GetDetalheAsync(new VendaId(vendaId));
            return venda != null && venda.Cliente.Id.AsGuid() == clienteId;
        }

        public async Task<VendaDto> AddAsync(CreatingVendaDto dto)
        {
            if (!Enum.TryParse<VendaEstado>(dto.Estado, out var status))
            {
                throw new BusinessRuleValidationException($"Status inválido: {dto.Estado}");
            }

            var cliente = await this._clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var venda = new Venda(
                new VendaData(dto.Data),
                status,
                new VendaTotal(dto.Total),
                cliente,
                dto.Transportadora,
                dto.CodigoRastreio,
                dto.UrlRastreio,
                dto.DataEnvio,
                dto.NotasInternas
            );

            await this._repo.AddAsync(venda);
            await this._unitOfWork.CommitAsync();

            return new VendaDto(venda);
        }

       public async Task<VendaDto> UpdateAsync(VendaDto dto)
        {
            var venda = await this._repo.GetByIdAsync(new VendaId(dto.Id));

            if (venda == null)
                return null;

<<<<<<< Updated upstream
            if (!Enum.TryParse<VendaEstado>(dto.VendaEstado, out var status))
            {
                throw new BusinessRuleValidationException($"Status invÃ¡lido: {dto.VendaEstado}");
            }

            venda.AtualizarDados(
                new VendaData(dto.VendaData),
                status,
                new VendaTotal(dto.VendaTotal)
            );

            venda.AtualizarRastreio(
                dto.Transportadora,
                dto.CodigoRastreio,
                dto.UrlRastreio,
                dto.DataEnvio,
                dto.NotasInternas
            );
=======
            if (!string.IsNullOrWhiteSpace(dto.VendaEstado))
            {
                if (!Enum.TryParse<VendaEstado>(dto.VendaEstado, ignoreCase: true, out var estado))
                    throw new BusinessRuleValidationException($"Estado inválido: {dto.VendaEstado}");
                venda.AtualizarEstado(estado);
            }
>>>>>>> Stashed changes

            await this._unitOfWork.CommitAsync();

            return new VendaDto(venda);
        }

        public async Task<VendaDto> DeleteAsync(VendaId id)
        {
            var venda = await this._repo.GetByIdAsync(id);

            if (venda == null)
                return null;

            this._repo.Remove(venda);
            await this._unitOfWork.CommitAsync();

            return new VendaDto(venda);
        }
    }
}
