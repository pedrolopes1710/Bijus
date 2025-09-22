using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dddnetcore.Domain.Produtos;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;

namespace dddnetcore.Infraestructure.Produtos
{
    public class ProdutoRepository : BaseRepository<Produto, ProdutoId>, IProdutoRepository
    {
        private readonly DDDSample1DbContext _context;
        
        public ProdutoRepository(DDDSample1DbContext context) : base(context.Produtos)
        {
            _context = context;
        }

        public async Task<Produto> UpdateAsync(Produto produto)
        {
            _context.Produtos.Update(produto);
            await _context.SaveChangesAsync();
            return produto;
        }
    }
}