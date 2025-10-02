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
            builder.HasOne(b => b.Cliente)
                .WithMany()
                .HasForeignKey("ClienteId")
                .IsRequired();
            
        }
    }
}