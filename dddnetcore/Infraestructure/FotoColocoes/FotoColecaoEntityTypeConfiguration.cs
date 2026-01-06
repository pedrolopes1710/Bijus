using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Domain.Colecoes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.FotoColecoes
{
    public class FotoColecaoEntityTypeConfiguration 
        : IEntityTypeConfiguration<FotoColecao>
    {
        public void Configure(EntityTypeBuilder<FotoColecao> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new FotoColecaoId(guid));

            builder.Property(f => f.UrlColecao)
                .HasConversion(
                    url => url.Url,
                    url => new UrlColecao(url))
                .IsRequired();

            builder.Property(f => f.ColecaoId)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new ColecaoId(guid))
                .IsRequired();
            
            builder.HasOne<Colecao>()
                .WithMany(p => p.FotoColecao)
                .HasForeignKey(f => f.ColecaoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
