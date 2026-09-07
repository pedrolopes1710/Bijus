using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Users;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;

        public UsersController(UserService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "superadmin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            try
            {
                var users = await _service.GetAllAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "superadmin")]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            try
            {
                var user = await _service.GetByIdAsync(new UserId(id));
                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto)
        {
            try
            {
                var user = await _service.AddClienteAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("admin")]
        [Authorize(Roles = "superadmin")]
        public async Task<ActionResult<UserDto>> CreateBackofficeUser(CreatingUserDto dto)
        {
            try
            {
                var user = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "superadmin")]
        public async Task<ActionResult<UserDto>> Update(Guid id, UserDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID não corresponde." });

            try
            {
                var user = await _service.UpdateAsync(dto);
                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "superadmin")]
        [HttpDelete("{id}")]
        [Authorize(Roles = "superadmin")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(new UserId(id));
                return NoContent();
            }
            catch (BusinessRuleValidationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            try
            {
                var login = await _service.LoginAsync(dto.UserOrEmail, dto.UserPassword);
                return Ok(login);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/Users/google  -> criar/entrar com conta Google
        [HttpPost("google")]
        public async Task<ActionResult> Google([FromBody] GoogleLoginDto dto)
        {
            try
            {
                var login = await _service.LoginOrRegisterGoogleAsync(dto?.IdToken);
                return Ok(login);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/Users/confirmar  -> confirma a conta a partir do token do email (devolve sessão iniciada)
        [HttpPost("confirmar")]
        public async Task<ActionResult> ConfirmarEmail([FromBody] ConfirmarEmailDto dto)
        {
            try
            {
                var login = await _service.ConfirmarEmailAsync(dto?.Token);
                return Ok(login);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/Users/reenviar-confirmacao  -> reenvia o email de confirmação
        [HttpPost("reenviar-confirmacao")]
        public async Task<ActionResult> ReenviarConfirmacao([FromBody] ReenviarConfirmacaoDto dto)
        {
            try
            {
                await _service.ReenviarConfirmacaoAsync(dto?.UserOrEmail);
                // Resposta neutra para não revelar se a conta existe.
                return Ok(new { message = "Se a conta existir e ainda não estiver confirmada, enviámos um novo email." });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
