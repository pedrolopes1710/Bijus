using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Categorias;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriasController(CategoriaService service)
        {
            _service = service;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDto>> GetById(Guid id)
        {
            var categoria = await _service.GetByIdAsync(new CategoriaId(id));

            if (categoria == null)
            {
                return NotFound();
            }

            return categoria;
        }

        // POST: api/Categorias
        [HttpPost]
        public async Task<ActionResult<CategoriaDto>> Create(CreatingCategoriaDto dto)
        {
            try {
                CategoriaDto categoria = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
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

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoriaDto>> Update(Guid id, CategoriaDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var categoria = await _service.UpdateAsync(dto);

                if (categoria == null)
                {
                    return NotFound();
                }
                return Ok(categoria);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CategoriaDto>> HardDelete(Guid id)
        {
            try
            {
                var categoria = await _service.DeleteAsync(new CategoriaId(id));

                if (categoria == null)
                {
                    return NotFound();
                }

                return Ok(categoria);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}