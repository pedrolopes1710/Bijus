using System;
using DDDSample1.Domain.Shared;

namespace dddnetcore.Domain.Categorias
{
    public class Categoria : Entity<CategoriaId>, IAggregateRoot
    {
        public NomeCategoria NomeCategoria { get; private set; }
        private Categoria() { }

        public Categoria(
            NomeCategoria nomeCategoria
        )

        {
            if (nomeCategoria == null)
                throw new BusinessRuleValidationException("NomeCategoria cannot be null.");

            this.Id = new CategoriaId(Guid.NewGuid());
            this.NomeCategoria = nomeCategoria;
        }
        public void ChangeNomeCategoria(NomeCategoria novoNome)
        {
            this.NomeCategoria = novoNome;
        }
    }
    
}
