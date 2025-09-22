using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dddnetcore.Domain.Categorias;

using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;

namespace dddnetcore.Infraestructure.Categorias
{
    public class CategoriaRepository : BaseRepository<Categoria, CategoriaId>, ICategoriaRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public CategoriaRepository(DDDSample1DbContext context) : base(context.Categorias)
        {
            _context = context;
        }

        public async Task<Categoria> UpdateAsync(Categoria categoria)
        {
            _context.Categorias.Update(categoria);
            await _context.SaveChangesAsync();
            return categoria;
        }
    }
}