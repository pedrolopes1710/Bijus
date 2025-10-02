using dddnetcore.Domain.Clientes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.Clientes
{
    
    public class ClienteEntityTypeConfiguration : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new ClienteId(guid));
            builder.Property(b => b.NomeCliente)
                .HasConversion(
                    b => b.Nome,
                    b => new NomeCliente(b)).IsRequired();
            builder.Property(b => b.EmailCliente)
                .HasConversion(
                    b => b.Email,
                    b => new EmailCliente(b)).IsRequired();
            builder.Property(b => b.MoradaCliente)
                .HasConversion(
                    b => b.Morada,
                    b => new MoradaCliente(b)).IsRequired();
            
        }
    }
}