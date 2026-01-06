using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Domain.Produtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.FotoProdutos
{
    public class FotoProdutoEntityTypeConfiguration 
        : IEntityTypeConfiguration<FotoProduto>
    {
        public void Configure(EntityTypeBuilder<FotoProduto> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new FotoProdutoId(guid));

            builder.Property(f => f.UrlProduto)
                .HasConversion(
                    url => url.Url,
                    url => new UrlProduto(url))
                .IsRequired();

            builder.Property(f => f.ProdutoId)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new ProdutoId(guid))
                .IsRequired();
            
            builder.HasOne<Produto>()
                .WithMany(p => p.FotoProduto)
                .HasForeignKey(f => f.ProdutoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
