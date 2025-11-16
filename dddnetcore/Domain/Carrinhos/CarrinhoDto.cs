using dddnetcore.Domain.Clientes;

namespace dddnetcore.Domain.Carrinhos
{
    public class CarrinhoDto
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; private set; }
        public DateTime DataCriacao { get; private set; }   
        public DateTime DataAtualizacao { get; private set; }
        public List<Guid> Items { get; private set; }

        public CarrinhoDto() { }

        public CarrinhoDto(Carrinho carrinho)
        {
            this.Id = carrinho.Id.AsGuid();
            this.ClienteId = carrinho.Cliente.Id.AsGuid();
            this.DataCriacao = carrinho.DataCriacao.Data;
            this.DataAtualizacao = carrinho.DataAtualizacao.Data;
            this.Items = carrinho.Itens.Select(item => item.Id.AsGuid()).ToList();  
        }
    }
}