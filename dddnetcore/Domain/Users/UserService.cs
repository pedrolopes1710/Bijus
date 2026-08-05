using BCrypt.Net;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace dddnetcore.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IClienteRepository _clienteRepo;
        private readonly ILogger<UserService> _logger;
        private readonly string _jwtSecret;

        public UserService(
            IUnitOfWork unitOfWork,
            IUserRepository repo,
            IClienteRepository clienteRepo,
            ILogger<UserService> logger,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _clienteRepo = clienteRepo;
            _logger = logger;
            _jwtSecret = configuration["JwtSettings:Secret"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? throw new InvalidOperationException("JWT secret não configurado.");
        }

        public async Task<List<UserDto>> GetAllAsync(Guid? userId = null)
        {
            if (userId != null)
            {
                return (await _repo.GetUserAsync(userId)).ConvertAll(user => new UserDto(user));
            }

            return (await _repo.GetAllAsync()).ConvertAll(user => new UserDto(user));
        }

        public async Task<UserDto> GetByIdAsync(UserId id)
        {
            var user = await _repo.GetByIdAsync(id);
            return user == null ? null : new UserDto(user);
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var cliente = await _clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var user = new User(
                new UserName(dto.UserName),
                new UserPassword(dto.UserPassword),
                cliente,
                dto.Role
            );

            await _repo.AddAsync(user);
            await _unitOfWork.CommitAsync();

            return new UserDto(user);
        }

        public Task<UserDto> AddClienteAsync(CreatingUserDto dto)
        {
            dto.Role = "cliente";
            return AddAsync(dto);
        }

        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var user = await _repo.GetByIdAsync(new UserId(dto.Id));

            if (user == null)
                return null;

            var clienteId = dto.ClienteDto?.Id ?? Guid.Empty;
            var cliente = await _clienteRepo.GetByIdAsync(new ClienteId(clienteId));

            if (user.Role == "superadmin" && dto.Role != "superadmin")
            {
                var superadmins = (await _repo.GetAllAsync()).Count(item => item.Role == "superadmin");
                if (superadmins <= 1)
                    throw new BusinessRuleValidationException("A loja tem de manter pelo menos um superadministrador.");
            }

            user.AtualizarDados(new UserName(dto.UserName), cliente, dto.Role);

            await _unitOfWork.CommitAsync();

            return new UserDto(user);
        }

        public async Task<UserDto> DeleteAsync(UserId id)
        {
            var user = await _repo.GetByIdAsync(id);

            if (user == null)
                return null;

            if (user.Role == "superadmin")
            {
                var superadmins = (await _repo.GetAllAsync()).Count(item => item.Role == "superadmin");
                if (superadmins <= 1)
                    throw new BusinessRuleValidationException("Não é possível apagar o último superadministrador.");
            }

            _repo.Remove(user);
            await _unitOfWork.CommitAsync();

            return new UserDto(user);
        }

        public async Task<LoginResponseDto> LoginAsync(string userOrEmail, string password)
        {
            if (string.IsNullOrEmpty(userOrEmail) || string.IsNullOrEmpty(password))
                throw new BusinessRuleValidationException("Nome de utilizador e password são obrigatórios.");

            var user = await _repo.GetByUsernameOrEmailAsync(userOrEmail);
            if (user == null)
                throw new BusinessRuleValidationException("Utilizador não encontrado.");

            _logger.LogInformation("Tentativa de login para: {UserOrEmail}", userOrEmail);

            if (!user.UserPassword.VerifyPassword(password))
                throw new BusinessRuleValidationException("Password incorreta.");

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
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("role", user.Role),
                new Claim("cliente_id", user.Cliente.Id.AsGuid().ToString()),
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
