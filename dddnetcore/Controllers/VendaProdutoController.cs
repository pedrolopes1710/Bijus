using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.VendaProdutos;
using Microsoft.AspNetCore.Authorization;
using dddnetcore.Domain.Vendas;
using System.Security.Claims;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendaProdutosController : ControllerBase
    {
        private readonly VendaProdutoService _service;
        private readonly VendaService _vendaService;

        public VendaProdutosController(VendaProdutoService service, VendaService vendaService)
        {
            _service = service;
            _vendaService = vendaService;
        }

        // GET: api/VendaProdutos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendaProdutoDto>>> GetAll([FromQuery] Guid? vendaId = null)
        {
            return await _service.GetAllAsync(vendaId);
        }

        // GET: api/VendaProdutos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VendaProdutoDto>> GetById(Guid id)
        {
            var vendaProduto = await _service.GetByIdAsync(new VendaProdutoId(id));

            if (vendaProduto == null)
            {
                return NotFound();
            }

            return vendaProduto;
        }

        // POST: api/VendaProdutos
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<VendaProdutoDto>> Create(CreatingVendaProdutoDto dto)
        {
            if (!User.IsInRole("admin") && !User.IsInRole("superadmin"))
            {
                if (!Guid.TryParse(User.FindFirstValue("cliente_id"), out var clienteId) ||
                    !await _vendaService.PertenceAoClienteAsync(dto.VendaId, clienteId))
                    return Forbid();
            }

            try 
            {
                var vendaProduto = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = vendaProduto.Id }, vendaProduto);
            } 
            catch (BusinessRuleValidationException e) 
            {
                return BadRequest(new {Message = e.Message});
            } 
            catch (NullReferenceException e) 
            {
                return NotFound(new {Message = e.Message});
            } 
            catch (ArgumentNullException e) 
            {
                return BadRequest(new {Message = e.Message});
            } 
            catch (Exception) 
            {
                return StatusCode(500, new { Message = "An unexpected error occurred." });
            }
        }

        // DELETE: api/VendaProdutos/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<VendaProdutoDto>> Update(Guid id, VendaProdutoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var vendaProduto = await _service.UpdateAsync(dto);

                if (vendaProduto == null)
                {
                    return NotFound();
                }

                return Ok(vendaProduto);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/VendaProdutos/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<VendaProdutoDto>> Delete(Guid id)
        {
            try
            {
                var vendaProduto = await _service.DeleteAsync(new VendaProdutoId(id));

                if (vendaProduto == null)
                {
                    return NotFound();
                }

                return Ok(vendaProduto);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}
