namespace dddnetcore.Domain.Categorias
{
    public class CategoriaDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }

        public CategoriaDto() {}

        public CategoriaDto(Categoria categoria)
        {
            if (categoria == null)
            {
                this.Id = Guid.Empty;
                this.Nome = null;
                return;
            }

            this.Id = categoria.Id.AsGuid();
            this.Nome = categoria.NomeCategoria?.Nome;
        }
    }
}