using dddnetcore.Domain.VendaProdutos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.VendaProdutos
{
    public class VendaProdutoEntityTypeConfiguration : IEntityTypeConfiguration<VendaProduto>
    {
        public void Configure(EntityTypeBuilder<VendaProduto> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new VendaProdutoId(guid));

            builder.Property(b => b.Quantidade)
                .HasConversion(
                    q => q.Value,
                    v => new Quantidade(v))
                .IsRequired();

            builder.Property(b => b.PrecoUnitario)
                .HasConversion(
                    p => p.Value,
                    v => new PrecoUnitario(v))
                .IsRequired();

            builder.HasOne(b => b.Venda)
                .WithMany()
                .HasForeignKey("VendaId")
                .IsRequired();

            builder.HasOne(b => b.Produto)
                .WithMany()
                .HasForeignKey("ProdutoId")
                .IsRequired();
        }
    }
}