using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Vendas;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendasController : ControllerBase
    {
        private readonly VendaService _service;

        public VendasController(VendaService service)
        {
            _service = service;
        }

        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendaDto>>> GetAll([FromQuery] Guid? clienteId = null)
        {
            return await _service.GetAllAsync(clienteId);
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VendaDto>> GetById(Guid id)
        {
            var venda = await _service.GetByIdAsync(new VendaId(id));

            if (venda == null)
            {
                return NotFound();
            }

            return venda;
        }

        // POST: api/Produtos
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<VendaDto>> Create(CreatingVendaDto dto)
        {
            if (!User.IsInRole("admin") && !User.IsInRole("superadmin") &&
                (!Guid.TryParse(User.FindFirstValue("cliente_id"), out var clienteId) || clienteId != dto.ClienteId))
                return Forbid();

            try {
                VendaDto venda = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = venda.Id }, venda);
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

        // PUT: api/Vendas/5  -> mudar estado da encomenda (logística)
        [Authorize(Roles = "admin,super_admin")]
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<VendaDto>> Update(Guid id, VendaDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var venda = await _service.UpdateAsync(dto);

                if (venda == null)
                {
                    return NotFound();
                }
                return Ok(venda);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/Vendas/5
        [Authorize(Roles = "admin,super_admin")]
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<VendaDto>> HardDelete(Guid id)
        {
            try
            {
                var venda = await _service.DeleteAsync(new VendaId(id));

                if (venda == null)
                {
                    return NotFound();
                }

                return Ok(venda);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}
