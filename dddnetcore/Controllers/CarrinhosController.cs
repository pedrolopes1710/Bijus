using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Domain.Carrinhos;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarrinhosController : ControllerBase
    {
        private readonly CarrinhoService _service;

        public CarrinhosController(CarrinhoService service)
        {
            _service = service;
        }

        // GET: api/Produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarrinhoDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarrinhoDto>> GetById(Guid id)
        {
            var Carrinho = await _service.GetByIdAsync(new CarrinhoId(id));

            if (Carrinho == null)
            {
                return NotFound();
            }

            return Carrinho;
        }

        // POST: api/itensCarrinho
        [HttpPost]
        public async Task<ActionResult<CreatingCarrinhoDto>> Create(CreatingCarrinhoDto dto)
        {
            Console.WriteLine(dto.ClienteId);
            try {
                CarrinhoDto Carrinho = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = Carrinho.Id }, Carrinho);
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
        public async Task<ActionResult<CarrinhoDto>> Update(Guid id, CarrinhoDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var Carrinho = await _service.UpdateAsync(dto);

                if (Carrinho == null)
                {
                    return NotFound();
                }
                return Ok(Carrinho);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // DELETE: api/ItensCarrinho/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CarrinhoDto>> HardDelete(Guid id)
        {
            try
            {
                var Carrinho = await _service.DeleteAsync(new CarrinhoId(id));

                if (Carrinho == null)
                {
                    return NotFound();
                }

                return Ok(Carrinho);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
    }
}