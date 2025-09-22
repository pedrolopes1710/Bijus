using System;

namespace dddnetcore.Domain.Produtos
{
    public class CreatingProdutoDto
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Preco { get; set; }
        public int Stock { get; set; } 
        public Guid CategoriaId { get; set; }
    }
}