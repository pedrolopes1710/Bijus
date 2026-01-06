using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly ProdutoService _service;

        public ProdutosController(ProdutoService service)
        {
            _service = service;
        }

        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProdutoDto>> GetById(Guid id)
        {
            var produto = await _service.GetByIdAsync(new ProdutoId(id));

            if (produto == null)
            {
                return NotFound();
            }

            return produto;
        }

        // POST: api/Produtos
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatingProdutoDto dto)
        {
            try {
                ProdutoDto produto = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
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
        public async Task<ActionResult<ProdutoDto>> Update(Guid id, ProdutoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var produto = await _service.UpdateAsync(dto);

                if (produto == null)
                {
                    return NotFound();
                }
                return Ok(produto);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/Produtos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ProdutoDto>> HardDelete(Guid id)
        {
            try
            {
                var produto = await _service.DeleteAsync(new ProdutoId(id));

                if (produto == null)
                {
                    return NotFound();
                }

                return Ok(produto);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}