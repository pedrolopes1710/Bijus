using dddnetcore.Domain.Produtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.Produtos
{
    
    public class ProdutoEntityTypeConfiguration : IEntityTypeConfiguration<Produto>
    {
        public void Configure(EntityTypeBuilder<Produto> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new ProdutoId(guid));
            builder.Property(b => b.NomeProduto)
                .HasConversion(
                    b => b.Nome,
                    b => new NomeProduto(b)).IsRequired();

            builder.Property(b => b.DescricaoProduto)
                .HasConversion(
                    b => b.Nome,
                    b => new DescricaoProduto(b)).IsRequired();

            builder.Property(b => b.StockProduto)
                .HasConversion(
                    b => b.Stock,
                    b => new StockProduto(b)).IsRequired();
            builder.Property(b => b.PrecoProduto)
                .HasConversion(
                    b => b.Preco,
                    b => new PrecoProduto(b)).IsRequired();

            builder.HasOne(b => b.Categoria)
                .WithMany()
                .HasForeignKey("CategoriaId")
                .IsRequired();
            
        }
    }
}