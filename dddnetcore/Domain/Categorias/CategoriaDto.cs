using System;

namespace dddnetcore.Domain.Categorias
{
    public class CategoriaDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }

        public CategoriaDto() {}

        public CategoriaDto(Categoria categoria)
        {
            this.Id = categoria.Id.AsGuid();
            this.Nome = categoria.NomeCategoria.Nome;
        }
    }
}