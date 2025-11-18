using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using BCrypt.Net;

namespace dddnetcore.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IClienteRepository _clienteRepo;
        private readonly ILogger<UserService> _logger;
         private readonly string _jwtSecret = "ef103f0c234ab2ae5807ac14c6c055f869a785fa06dfac00e96441703b5ca733";

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo, IClienteRepository clienteRepo,ILogger<UserService> logger)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._clienteRepo = clienteRepo;
            this._logger = logger;
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
        public async Task<LoginResponseDto> LoginAsync(string userOrEmail, string password)
        {
            if (string.IsNullOrEmpty(userOrEmail) || string.IsNullOrEmpty(password))
                throw new BusinessRuleValidationException("Nome de usuário e senha são obrigatórios.");

            var user = await _repo.GetByUsernameOrEmailAsync(userOrEmail);
            if (user == null)
                throw new BusinessRuleValidationException("Usuário não encontrado.");

             // LOG
            _logger.LogInformation($"Tentativa de login para: {userOrEmail}");
            _logger.LogInformation($"Senha fornecida: {password}");
            _logger.LogInformation($"Hash armazenado: {user.UserPassword.Password}");

            var isValid = user.UserPassword.VerifyPassword(password);
            _logger.LogInformation($"Verificação de senha: {isValid}");

            if (!isValid)
                throw new BusinessRuleValidationException("Senha incorreta.");
            
            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = new UserDto(user)
            };
           
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.AsGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName.Nome),

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