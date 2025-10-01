using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Vendas;

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
        public async Task<ActionResult<IEnumerable<VendaDto>>> GetAll()
        {
            return await _service.GetAllAsync();
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
        public async Task<ActionResult<VendaDto>> Create(CreatingVendaDto dto)
        {
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

        // PUT: api/Produtos/5
        [HttpPut("{id}")]
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

        // DELETE: api/Produtos/5
        [HttpDelete("{id}")]
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