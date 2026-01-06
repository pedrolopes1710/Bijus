using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.FotoColecoes;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FotoColecoesController : ControllerBase
    {
        private readonly FotoColecaoService _service;

        public FotoColecoesController(FotoColecaoService service)
        {
            _service = service;
        }

        // GET: api/FotoColecaos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FotoColecaoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/FotoColecaos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FotoColecaoDto>> GetById(Guid id)
        {
            var foto = await _service.GetByIdAsync(new FotoColecaoId(id));

            if (foto == null)
            {
                return NotFound();
            }

            return foto;
        }

        // PUT: api/FotoColecaos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<FotoColecaoDto>> Update(Guid id, FotoColecaoDto dto)
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

        // DELETE: api/FotoColecaos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FotoColecaoDto>> HardDelete(Guid id)
        {
            try
            {
                var foto = await _service.DeleteAsync(new FotoColecaoId(id));

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