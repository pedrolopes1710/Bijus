using DDDSample1.Domain.Shared;
using dddnetcore.Domain.GruposVariantes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruposVariantesController : ControllerBase
    {
        private readonly GrupoVariantesService _service;
        public GruposVariantesController(GrupoVariantesService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GrupoVariantesDto>>> GetAll() => await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<GrupoVariantesDto>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(new GrupoVariantesId(id));
            return item == null ? NotFound() : item;
        }

        [HttpPost]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<GrupoVariantesDto>> Create(CreatingGrupoVariantesDto dto)
        {
            try
            {
                var item = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
            }
            catch (BusinessRuleValidationException ex) { return BadRequest(new { ex.Message }); }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<GrupoVariantesDto>> Update(Guid id, GrupoVariantesDto dto)
        {
            if (id != dto.Id) return BadRequest();
            try
            {
                var item = await _service.UpdateAsync(dto);
                return item == null ? NotFound() : Ok(item);
            }
            catch (BusinessRuleValidationException ex) { return BadRequest(new { ex.Message }); }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,superadmin")]
        public async Task<ActionResult<GrupoVariantesDto>> Delete(Guid id)
        {
            var item = await _service.DeleteAsync(new GrupoVariantesId(id));
            return item == null ? NotFound() : Ok(item);
        }
    }
}
