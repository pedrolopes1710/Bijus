using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
// Ensure the correct namespace for Produto is imported
using dddnetcore.Domain.Produtos;

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
            

            builder.HasOne(p => p.Categorias)
                .WithOne()
                .HasForeignKey("ProdutoId");
            
        }
    }
}