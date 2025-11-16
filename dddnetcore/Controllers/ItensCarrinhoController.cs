using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Domain.Carrinhos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItensCarrinhoController : ControllerBase
    {
        private readonly ItemCarrinhoService _service;

        public ItensCarrinhoController(ItemCarrinhoService service)
        {
            _service = service;
        }

        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemCarrinhoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemCarrinhoDto>> GetById(Guid id)
        {
            var itemCarrinho = await _service.GetByIdAsync(new ItemCarrinhoId(id));

            if (itemCarrinho == null)
            {
                return NotFound();
            }

            return itemCarrinho;
        }

        // POST: api/itensCarrinho
        [HttpPost]
        public async Task<ActionResult<CreatingItemCarrinhoDto>> Create(CreatingItemCarrinhoDto dto)
        {
            
            try {
                ItemCarrinhoDto itemCarrinho = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = itemCarrinho.Id }, itemCarrinho);
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

        // PUT: api/ItensCarrinho/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ItemCarrinhoDto>> Update(Guid id, ItemCarrinhoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var itemCarrinho = await _service.UpdateAsync(dto);

                if (itemCarrinho == null)
                {
                    return NotFound();
                }
                return Ok(itemCarrinho);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/ItensCarrinho/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ItemCarrinhoDto>> HardDelete(Guid id)
        {
            try
            {
                var itemCarrinho = await _service.DeleteAsync(new ItemCarrinhoId(id));

                if (itemCarrinho == null)
                {
                    return NotFound();
                }

                return Ok(itemCarrinho);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}