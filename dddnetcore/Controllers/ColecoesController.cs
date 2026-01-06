using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Colecoes;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColecoesController : ControllerBase
    {
        private readonly ColecaoService _service;

        public ColecoesController(ColecaoService service)
        {
            _service = service;
        }

        // GET: api/FotoColecaos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColecaoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/FotoColecaos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ColecaoDto>> GetById(Guid id)
        {
            var colecao = await _service.GetByIdAsync(new ColecaoId(id));

            if (colecao == null)
            {
                return NotFound();
            }

            return colecao;
        }
        // POST: api/Produtos
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatingColecaoDto dto)
        {
            try {
                ColecaoDto colecao = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = colecao.Id }, colecao);
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
        // PUT: api/FotoColecaos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ColecaoDto>> Update(Guid id, ColecaoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var colecao = await _service.UpdateAsync(dto);

                if (colecao == null)
                {
                    return NotFound();
                }
                return Ok(colecao);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/FotoColecaos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ColecaoDto>> HardDelete(Guid id)
        {
            try
            {
                var colecao = await _service.DeleteAsync(new ColecaoId(id));

                if (colecao == null)
                {
                    return NotFound();
                }

                return Ok(colecao);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}