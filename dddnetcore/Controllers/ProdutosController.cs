using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using Microsoft.AspNetCore.Authorization;

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
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Produtos/5
        [AllowAnonymous]
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
        [Authorize(Roles = "super_admin")]
        [HttpPost]
        [Authorize(Roles = "admin,superadmin")]
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

        // PUT: api/Produtos/5/stock  -> gestão de logística (admin) ou super_admin
        [Authorize(Roles = "admin,super_admin")]
        [HttpPut("{id}/stock")]
        public async Task<ActionResult<ProdutoDto>> UpdateStock(Guid id, [FromBody] AtualizarStockDto dto)
        {
            try
            {
                var produto = await _service.AtualizarStockAsync(id, dto.Stock);
                if (produto == null) return NotFound();
                return Ok(produto);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // PUT: api/Produtos/5
        [Authorize(Roles = "super_admin")]
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,superadmin")]
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
        [Authorize(Roles = "super_admin")]
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,superadmin")]
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
