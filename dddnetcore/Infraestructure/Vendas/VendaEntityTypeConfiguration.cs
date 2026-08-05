using dddnetcore.Domain.Vendas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace dddnetcore.Infraestructure.Vendas
{
    
    public class VendaEntityTypeConfiguration : IEntityTypeConfiguration<Venda>
    {
        public void Configure(EntityTypeBuilder<Venda> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new VendaId(guid));
            builder.Property(b => b.VendaData)
                .HasConversion(
                    b => b.Data,
                    b => new VendaData(b)).IsRequired();

             builder.Property(b=>b.VendaEstado).HasConversion(new EnumToStringConverter<VendaEstado>()).IsRequired();

            builder.Property(b => b.VendaTotal)
                .HasConversion(
                    b => b.Total,
                    b => new VendaTotal(b)).IsRequired();

            builder.Property(b => b.Transportadora)
                .HasMaxLength(80);

            builder.Property(b => b.CodigoRastreio)
                .HasMaxLength(120);

            builder.Property(b => b.UrlRastreio)
                .HasMaxLength(600);

            builder.Property(b => b.DataEnvio);

            builder.Property(b => b.NotasInternas)
                .HasMaxLength(1000);

            builder.Property(b => b.MetodoPagamento).HasMaxLength(40);
            builder.Property(b => b.PagamentoProvider).HasMaxLength(40);
            builder.Property(b => b.PagamentoReferencia).HasMaxLength(255);
            builder.Property(b => b.PagamentoEstado).HasMaxLength(80);

            builder.HasOne(b => b.Cliente)
                .WithMany()
                .HasForeignKey("ClienteId")
                .IsRequired();
            
        }
    }
}
