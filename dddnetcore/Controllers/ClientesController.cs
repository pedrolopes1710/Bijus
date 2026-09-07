using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Clientes;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ClienteService _service;

        public ClientesController(ClienteService service)
        {
            _service = service;
        }

        // GET: api/Clientes
        [HttpGet]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<ClienteDto>> GetById(Guid id)
        {
            var cliente = await _service.GetByIdAsync(new ClienteId(id));

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<ClienteDto>> Create(CreatingClienteDto dto)
        {
            try {
                ClienteDto cliente = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
            } catch (BusinessRuleValidationException e) {
                return BadRequest(new {e.Message});
            } catch (NullReferenceException e) {
                return NotFound(new {e.Message});
            } catch (ArgumentNullException e) {
                return BadRequest(new {e.Message});
            } catch (Exception) {
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        // PUT: api/Clientes/5  -> o próprio cliente ou um gestor podem editar
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ClienteDto>> Update(Guid id, ClienteDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            var proprio = string.Equals(User.FindFirstValue("cliente_id"), id.ToString(), StringComparison.OrdinalIgnoreCase);
            var gestor = User.IsInRole("admin") || User.IsInRole("superadmin");
            if (!proprio && !gestor)
            {
                return Forbid();
            }

            try
            {
                var cliente = await _service.UpdateAsync(dto);

                if (cliente== null)
                {
                    return NotFound();
                }
                return Ok(cliente);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/Categorias/5
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "superadmin")]
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<ClienteDto>> HardDelete(Guid id)
        {
            try
            {
                var cliente = await _service.DeleteAsync(new ClienteId(id));

                if (cliente == null)
                {
                    return NotFound();
                }

                return Ok(cliente);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}
