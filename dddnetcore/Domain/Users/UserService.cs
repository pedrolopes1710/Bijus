using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace dddnetcore.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IClienteRepository _clienteRepo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo, IClienteRepository clienteRepo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._clienteRepo = clienteRepo;
        }

        public async Task<List<UserDto>> GetAllAsync(Guid? userId = null) {
            if (userId != null) {
                return (await this._repo.GetUserAsync(userId)).ConvertAll(user => new UserDto(user));
            }
            return (await this._repo.GetAllAsync()).ConvertAll(produto => new UserDto(produto));
        }
        public async Task<UserDto> GetByIdAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);
            return user == null ? null : new UserDto(user);
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var cliente = await this._clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var user = new User(
                new UserName(dto.UserName),
                new UserPassword(dto.UserPassword),
                cliente
            );

            await this._repo.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto(user);
        }

       public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var user = await this._repo.GetByIdAsync(new UserId(dto.Id));

            if (user == null)
                return null;

            //produto.ChangeNomeProduto(new NomeProduto(dto.Nome));
            //produto.ChangeDescricaoProduto(new DescricaoProduto(dto.Descricao));
            //produto.ChangePrecoProduto(new PrecoProduto(dto.Preco));

            await this._unitOfWork.CommitAsync();

            return new UserDto(user);
        }

        public async Task<UserDto> DeleteAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto(user);
        }
        public async Task<string> LoginAsync(string userOrEmail, string password)
        {
            User user = null;

            // 1 — tentar buscar por username
            user = await _repo.GetByUsernameAsync(userOrEmail);

            // 2 — se não achou, tentar por email
            if (user == null)
            {
                var cliente = await _clienteRepository.GetByEmailAsync(userOrEmail);
                if (cliente != null)
                {
                    user = await _userRepository.GetByIdAsync(cliente.UserId);
                }
            }

            if (user == null)
                return null;

            // Validar password
            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
                return null;

            // Buscar Cliente associado ao User
            var userCliente = await _clienteRepository.GetByUserIdAsync(user.Id);

            return GenerateJwtToken(user, userCliente);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ef103f0c234ab2ae5807ac14c6c055f869a785fa06dfac00e96441703b5ca733"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}