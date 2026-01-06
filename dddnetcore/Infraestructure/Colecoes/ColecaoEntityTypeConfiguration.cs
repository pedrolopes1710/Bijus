using dddnetcore.Domain.Colecoes;
using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Domain.Produtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.Colecoes
{
    public class ColecaoEntityTypeConfiguration : IEntityTypeConfiguration<Colecao>
    {
        public void Configure(EntityTypeBuilder<Colecao> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new ColecaoId(guid));

            builder.Property(c => c.NomeColecao)
                .HasConversion(
                    n => n.Nome,
                    v => new NomeColecao(v))
                .IsRequired();

            builder.Property(c => c.DescricaoColecao)
                .HasConversion(
                    d => d.Nome,
                    v => new DescricaoColecao(v))
                .IsRequired();

            builder.Property(c => c.DataCriacaoColecao)
                .HasConversion(
                    d => d.Data,
                    v => new DataCriacaoColecao(v))
                .IsRequired();

            builder.Property(c => c.DataAtualizacaoColecao)
                .HasConversion(
                    d => d.Data,
                    v => new DataAtualizacaoColecao(v))
                .IsRequired();

            builder.Property(c => c.EstadoColecao).IsRequired();

        }
    }
}
