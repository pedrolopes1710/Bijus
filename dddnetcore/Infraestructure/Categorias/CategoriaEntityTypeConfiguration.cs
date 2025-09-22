using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using dddnetcore.Domain.Categorias;

namespace dddnetcore.Infraestructure.Categorias
{
    
    public class CategoriaEntityTypeConfiguration : IEntityTypeConfiguration<Categoria>
    {
        public void Configure(EntityTypeBuilder<Categoria> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new CategoriaId(guid));
            builder.Property(b => b.NomeCategoria)
                .HasConversion(
                    b => b.Nome,
                    b => new NomeCategoria(b)).IsRequired();
            
        }
    }
}