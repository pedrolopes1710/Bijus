using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using dddnetcore.Domain.Produtos;
using dddnetcore.Domain.FotoProdutos;

namespace dddnetcore.Infraestructure.FotoProdutos
{
    
    public class FotoProdutoEntityTypeConfiguration : IEntityTypeConfiguration<FotoProduto>
    {
        public void Configure(EntityTypeBuilder<FotoProduto> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new FotoProdutoId(guid));
            builder.Property(b => b.UrlProduto)
                .HasConversion(
                    b => b.Url,
                    b => new UrlProduto(b)).IsRequired();

            builder.HasOne(b => b.Produto)
                .WithMany()
                .HasForeignKey("ProdutoId")
                .IsRequired();
            
        }
    }
}