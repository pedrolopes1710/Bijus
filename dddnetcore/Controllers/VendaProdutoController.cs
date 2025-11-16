using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.VendaProdutos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendaProdutosController : ControllerBase
    {
        private readonly VendaProdutoService _service;

        public VendaProdutosController(VendaProdutoService service)
        {
            _service = service;
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
        public async Task<ActionResult<VendaProdutoDto>> Create(CreatingVendaProdutoDto dto)
        {
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
        [HttpDelete("{id}")]
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