using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Clientes
{
    public class ClienteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IClienteRepository _repo;


        public ClienteService(IUnitOfWork unitOfWork, IClienteRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        
        }

        public async Task<List<ClienteDto>> GetAllAsync() {
    
            return (await this._repo.GetAllAsync()).ConvertAll(cliente => new ClienteDto(cliente));
        }
        public async Task<ClienteDto> GetByIdAsync(ClienteId id)
        {
            var cliente = await this._repo.GetByIdAsync(id);
            return cliente == null ? null : new ClienteDto(cliente);
        }

        public async Task<ClienteDto> AddAsync(CreatingClienteDto dto)
        {
            var cliente = new Cliente(
                new NomeCliente(dto.Nome),
                new EmailCliente(dto.Email),
                new MoradaCliente(dto.Morada)
            );

            await this._repo.AddAsync(cliente);
            await this._unitOfWork.CommitAsync();

            return new ClienteDto(cliente);
        }

       public async Task<ClienteDto> UpdateAsync(ClienteDto dto)
        {
            var cliente = await this._repo.GetByIdAsync(new ClienteId(dto.Id));

            if (cliente == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new ClienteDto(cliente);
        }

        public async Task<ClienteDto> DeleteAsync(ClienteId id)
        {
            var cliente = await this._repo.GetByIdAsync(id);

            if (cliente == null)
                return null;

            this._repo.Remove(cliente);
            await this._unitOfWork.CommitAsync();

            return new ClienteDto(cliente);
        }
    }
}