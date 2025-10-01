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
                cliente
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

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

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