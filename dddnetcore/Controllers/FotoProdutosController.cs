using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.FotoProdutos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FotoProdutosController : ControllerBase
    {
        private readonly FotoProdutoService _service;

        public FotoProdutosController(FotoProdutoService service)
        {
            _service = service;
        }

        // GET: api/FotoProdutos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FotoProdutoDto>>> GetAll([FromQuery] Guid? produtoId)
        {
            return await _service.GetAllAsync(produtoId);
        }

        // GET: api/FotoProdutos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FotoProdutoDto>> GetById(Guid id)
        {
            var foto = await _service.GetByIdAsync(new FotoProdutoId(id));

            if (foto == null)
            {
                return NotFound();
            }

            return foto;
        }

        // PUT: api/FotoProdutos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FotoProdutoDto>> Update(Guid id, FotoProdutoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var foto = await _service.UpdateAsync(dto);

                if (foto == null)
                {
                    return NotFound();
                }
                return Ok(foto);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/FotoProdutos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FotoProdutoDto>> HardDelete(Guid id)
        {
            try
            {
                var foto = await _service.DeleteAsync(new FotoProdutoId(id));

                if (foto == null)
                {
                    return NotFound();
                }

                return Ok(foto);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}