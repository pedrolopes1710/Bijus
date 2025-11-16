namespace dddnetcore.Domain.Carrinhos
{
    public class CreatingCarrinhoDto
    {
        public Guid ClienteId { get; set; }
        public DateTime DataCriacao { get; set; }   
        public DateTime DataAtualizacao { get; set; }
        public List<Guid> Items { get; set; }
    }
}
