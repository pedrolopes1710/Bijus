/*using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Tarefas;
using dddnetcore.Domain.Atividades;
using DDDSample1.Domain.Atividades;
using dddnetcore.Domain.Orcamentos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AtividadesController : ControllerBase
    {
        private readonly AtividadeService _service;

        public AtividadesController(AtividadeService service)
        {
            _service = service;
        }

        // GET: api/Atividades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AtividadeDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Atividades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AtividadeDto>> GetById(Guid id)
        {
            var atividade = await _service.GetByIdAsync(new AtividadeId(id));

            if (atividade == null)
            {
                return NotFound();
            }

            return atividade;
        }

        // POST: api/Tarefas
        [HttpPost]
        public async Task<ActionResult<AtividadeDto>> Create(CreatingAtividadeDto dto)
        {
           try {
                AtividadeDto atividade = await _service.AddAsync(dto);
                
                return CreatedAtAction(nameof(GetById), new { id = atividade.Id }, atividade);
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

        
        // PUT: api/Atividades/5
        [HttpPut("{id}")]
        public async Task<ActionResult<AtividadeDto>> Update(Guid id, AtividadeDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var tarefa = await _service.UpdateAsync(dto);
                
                if (tarefa == null)
                {
                    return NotFound();
                }
                return Ok(tarefa);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }        
        // DELETE: api/Atividades/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AtividadeDto>> HardDelete(Guid id)
        {
            try
            {
                var atividade = await _service.DeleteAsync(new AtividadeId(id));

                if (atividade == null)
                {
                    return NotFound();
                }

                return Ok(atividade);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}*/