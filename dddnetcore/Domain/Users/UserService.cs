using BCrypt.Net;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using dddnetcore.Domain.Emails;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace dddnetcore.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IClienteRepository _clienteRepo;
        private readonly ILogger<UserService> _logger;
        private readonly IEmailService _email;
        private readonly string _jwtSecret;
        private readonly string _googleClientId;
        private readonly string _publicSiteUrl;

        public UserService(
            IUnitOfWork unitOfWork,
            IUserRepository repo,
            IClienteRepository clienteRepo,
            ILogger<UserService> logger,
            IEmailService email,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _clienteRepo = clienteRepo;
            _logger = logger;
            _email = email;
            _jwtSecret = configuration["JwtSettings:Secret"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? throw new InvalidOperationException("JWT secret não configurado.");
            _googleClientId = configuration["Google:ClientId"]
                ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
                ?? string.Empty;
            _publicSiteUrl = (configuration["PublicSiteUrl"]
                ?? Environment.GetEnvironmentVariable("PublicSiteUrl")
                ?? "http://localhost:8090").TrimEnd('/');
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

        // Criação de conta de backoffice (superadmin) — conta de confiança, já confirmada.
        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var cliente = await _clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var user = new User(
                new UserName(dto.UserName),
                new UserPassword(dto.UserPassword),
                cliente,
                dto.Role
            );
            user.MarcarEmailConfirmado();

            await _repo.AddAsync(user);
            await _unitOfWork.CommitAsync();

            return new UserDto(user);
        }

        // Registo público de cliente — exige confirmação de email antes de poder comprar.
        public async Task<UserDto> AddClienteAsync(CreatingUserDto dto)
        {
            var cliente = await _clienteRepo.GetByIdAsync(new ClienteId(dto.ClienteId));
            var user = new User(
                new UserName(dto.UserName),
                new UserPassword(dto.UserPassword),
                cliente,
                "cliente"
            );
            var token = user.GerarTokenConfirmacao();

            await _repo.AddAsync(user);
            await _unitOfWork.CommitAsync();

            await EnviarEmailConfirmacao(cliente, token);

            return new UserDto(user);
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

            // Bootstrap: promove utilizadores das allowlists ao papel correspondente na BD.
            await AplicarBootstrapDeRole(user);

            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = new UserDto(user),
                Role = user.Role,
                IsAdmin = user.Role == "admin" || user.Role == "superadmin",
                EmailConfirmado = user.EmailConfirmado
            };
        }

        /// <summary>Confirma a conta a partir do token enviado por email e devolve uma sessão iniciada.</summary>
        public async Task<LoginResponseDto> ConfirmarEmailAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new BusinessRuleValidationException("Token de confirmação em falta.");

            var user = await _repo.GetByTokenConfirmacaoAsync(token);
            if (user == null)
                throw new BusinessRuleValidationException("Link de confirmação inválido ou já utilizado.");

            if (!user.EmailConfirmado)
            {
                if (user.TokenConfirmacaoExpirado())
                    throw new BusinessRuleValidationException("O link de confirmação expirou. Pede um novo email de confirmação.");

                user.ConfirmarEmail();
                await _unitOfWork.CommitAsync();
            }

            await AplicarBootstrapDeRole(user);

            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = new UserDto(user),
                Role = user.Role,
                IsAdmin = user.Role == "admin" || user.Role == "superadmin",
                EmailConfirmado = user.EmailConfirmado
            };
        }

        /// <summary>Reenvia o email de confirmação. Não revela se a conta existe.</summary>
        public async Task ReenviarConfirmacaoAsync(string userOrEmail)
        {
            if (string.IsNullOrWhiteSpace(userOrEmail))
                throw new BusinessRuleValidationException("Indica o teu email ou nome de utilizador.");

            var user = await _repo.GetByUsernameOrEmailAsync(userOrEmail);
            if (user == null || user.EmailConfirmado)
                return;

            var token = user.GerarTokenConfirmacao();
            await _unitOfWork.CommitAsync();
            await EnviarEmailConfirmacao(user.Cliente, token);
        }

        private async Task EnviarEmailConfirmacao(Cliente cliente, string token)
        {
            var email = cliente?.EmailCliente?.Email;
            if (string.IsNullOrWhiteSpace(email)) return;

            var nome = cliente?.NomeCliente?.Nome ?? "Cliente";
            var link = $"{_publicSiteUrl}/confirmar-conta?token={token}";
            var corpo = LayoutEmail(
                "Confirma a tua conta ✨",
                $"Olá {nome},<br><br>Falta só um passo para ativares a tua conta na Biscuit&amp;Arte. " +
                "Confirma o teu email para poderes finalizar compras:<br><br>" +
                $"<a href=\"{link}\" style=\"display:inline-block;background:#b03a5b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold\">Confirmar a minha conta</a>" +
                $"<br><br>Se o botão não funcionar, copia este link para o browser:<br><span style=\"color:#b03a5b;word-break:break-all\">{link}</span>" +
                "<br><br>Este link é válido durante 48 horas.");
            await _email.EnviarAsync(email, "Confirma a tua conta — Biscuit&Arte", corpo);
        }

        private static string LayoutEmail(string titulo, string conteudoHtml)
        {
            return $@"<div style=""font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden"">
  <div style=""background:#2b1a22;color:#fff;padding:20px 28px;font-size:20px;font-weight:bold"">Biscuit&amp;Arte</div>
  <div style=""padding:28px"">
    <h2 style=""margin:0 0 16px;color:#2b1a22;font-size:20px"">{titulo}</h2>
    <p style=""color:#444;font-size:15px;line-height:1.6;margin:0"">{conteudoHtml}</p>
  </div>
  <div style=""background:#faf6f2;color:#999;padding:16px 28px;font-size:12px"">Feito à mão em Portugal · Biscuit&amp;Arte</div>
</div>";
        }

        /// <summary>
        /// Autentica (ou cria automaticamente) uma conta a partir de um ID token do Google.
        /// Verifica o token, liga a uma conta existente pelo email, ou cria cliente + user (papel "cliente").
        /// </summary>
        public async Task<LoginResponseDto> LoginOrRegisterGoogleAsync(string idToken)
        {
            if (string.IsNullOrWhiteSpace(idToken))
                throw new BusinessRuleValidationException("Token do Google em falta.");

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings();
                if (!string.IsNullOrWhiteSpace(_googleClientId))
                    settings.Audience = new[] { _googleClientId };
                payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            }
            catch (Exception)
            {
                throw new BusinessRuleValidationException("Não foi possível validar a conta Google.");
            }

            var email = payload.Email?.Trim();
            if (string.IsNullOrWhiteSpace(email) || payload.EmailVerified != true)
                throw new BusinessRuleValidationException("A conta Google não tem um email verificado.");

            var nome = string.IsNullOrWhiteSpace(payload.Name) ? email.Split('@')[0] : payload.Name;

            var user = await _repo.GetByUsernameOrEmailAsync(email);
            if (user == null)
            {
                var cliente = new Cliente(new NomeCliente(nome), new EmailCliente(email), new MoradaCliente("Por preencher"));
                await _clienteRepo.AddAsync(cliente);

                var passwordAleatoria = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
                user = new User(new UserName(email), new UserPassword(passwordAleatoria), cliente, "cliente");
                user.MarcarEmailConfirmado(); // O Google já verificou o email.
                await _repo.AddAsync(user);
                await _unitOfWork.CommitAsync();
            }
            else if (!user.EmailConfirmado)
            {
                // Conta existente ligada via Google: o email está verificado pelo Google.
                user.MarcarEmailConfirmado();
                await _unitOfWork.CommitAsync();
            }

            await AplicarBootstrapDeRole(user);

            return new LoginResponseDto
            {
                Token = GenerateJwtToken(user),
                User = new UserDto(user),
                Role = user.Role,
                IsAdmin = user.Role == "admin" || user.Role == "superadmin",
                EmailConfirmado = user.EmailConfirmado
            };
        }

        /// <summary>
        /// Promove um utilizador ao papel definido nas allowlists (SUPER_ADMIN_USERS -> "superadmin",
        /// ADMIN_USERS -> "admin"), persistindo na BD. Serve para criar o primeiro superadmin.
        /// </summary>
        private async Task AplicarBootstrapDeRole(User user)
        {
            var desejado = PapelDesejadoDoEnv(user.UserName?.Nome);
            if (desejado != null && user.Role != desejado)
            {
                user.AtualizarDados(user.UserName, user.Cliente, desejado);
                await _unitOfWork.CommitAsync();
            }
        }

        private static string PapelDesejadoDoEnv(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return null;
            var u = username.Trim().ToLowerInvariant();
            if (MatchesAllowlist("SUPER_ADMIN_USERS", u)) return "superadmin";
            if (MatchesAllowlist("ADMIN_USERS", u)) return "admin";
            return null;
        }

        private static bool MatchesAllowlist(string envVar, string username)
        {
            var raw = Environment.GetEnvironmentVariable(envVar);
            if (string.IsNullOrWhiteSpace(raw)) return false;

            return raw
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Any(entry => entry.ToLowerInvariant() == username);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.AsGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName.Nome),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("role", user.Role),
                new Claim("cliente_id", user.Cliente.Id.AsGuid().ToString()),
                new Claim("email_confirmado", user.EmailConfirmado ? "true" : "false"),
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
