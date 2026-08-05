using dddnetcore.Domain.GruposVariantes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.GruposVariantes
{
    public class GrupoVariantesEntityTypeConfiguration : IEntityTypeConfiguration<GrupoVariantes>
    {
        public void Configure(EntityTypeBuilder<GrupoVariantes> builder)
        {
            builder.HasKey(item => item.Id);
            builder.Property(item => item.Id).HasConversion(id => id.AsGuid(), id => new GrupoVariantesId(id));
            builder.Property(item => item.Nome).HasMaxLength(120).IsRequired();
            builder.HasMany(item => item.Opcoes).WithOne(item => item.GrupoVariantes).HasForeignKey("GrupoVariantesId").OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(item => item.Variantes).WithOne(item => item.GrupoVariantes).HasForeignKey("GrupoVariantesId").OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class OpcaoProdutoEntityTypeConfiguration : IEntityTypeConfiguration<OpcaoProduto>
    {
        public void Configure(EntityTypeBuilder<OpcaoProduto> builder)
        {
            builder.ToTable("OpcoesProduto");
            builder.HasKey(item => item.Id);
            builder.Property(item => item.Nome).HasMaxLength(80).IsRequired();
            builder.HasIndex("GrupoVariantesId", "Nome").IsUnique();
            builder.HasMany(item => item.Valores).WithOne(item => item.Opcao).HasForeignKey("OpcaoProdutoId").OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class ValorOpcaoProdutoEntityTypeConfiguration : IEntityTypeConfiguration<ValorOpcaoProduto>
    {
        public void Configure(EntityTypeBuilder<ValorOpcaoProduto> builder)
        {
            builder.ToTable("ValoresOpcaoProduto");
            builder.HasKey(item => item.Id);
            builder.Property(item => item.Valor).HasMaxLength(100).IsRequired();
            builder.Property(item => item.CorHex).HasMaxLength(20);
            builder.HasIndex("OpcaoProdutoId", "Valor").IsUnique();
        }
    }

    public class VarianteProdutoEntityTypeConfiguration : IEntityTypeConfiguration<VarianteProduto>
    {
        public void Configure(EntityTypeBuilder<VarianteProduto> builder)
        {
            builder.ToTable("VariantesProduto");
            builder.HasKey(item => item.Id);
            builder.Property(item => item.Sku).HasMaxLength(100).IsRequired();
            builder.HasMany(item => item.Valores).WithOne(item => item.Variante).HasForeignKey(item => item.VarianteProdutoId).OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class VarianteProdutoValorEntityTypeConfiguration : IEntityTypeConfiguration<VarianteProdutoValor>
    {
        public void Configure(EntityTypeBuilder<VarianteProdutoValor> builder)
        {
            builder.ToTable("VariantesProdutoValores");
            builder.HasKey(item => new { item.VarianteProdutoId, item.ValorOpcaoProdutoId });
            builder.HasOne(item => item.ValorOpcao).WithMany().HasForeignKey(item => item.ValorOpcaoProdutoId).OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}
