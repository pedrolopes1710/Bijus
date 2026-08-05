namespace dddnetcore.Domain.FotoProdutos
{
    public class CreatingFotoProdutoUploadDto
    {
        public Guid ProdutoId { get; set; }
        public IFormFile Foto { get; set; }
    }
}
