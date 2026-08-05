namespace dddnetcore.Domain.FotoColecoes
{
    public class CreatingFotoColecaoUploadDto
    {
        public Guid ColecaoId { get; set; }
        public IFormFile Foto { get; set; }
    }
}
