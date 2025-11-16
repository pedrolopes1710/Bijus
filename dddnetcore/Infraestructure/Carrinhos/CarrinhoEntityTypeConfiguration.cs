using dddnetcore.Domain.Carrinhos;
using dddnetcore.Domain.Categorias;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.Carrinhos
{
    
    public class CarrinhoEntityTypeConfiguration : IEntityTypeConfiguration<Carrinho>
    {
        public void Configure(EntityTypeBuilder<Carrinho> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(),
                    guid => new CarrinhoId(guid));


            builder.Property(b => b.DataCriacao)
                .HasConversion(
                    b => b.Data,
                    b => new DataCriacaoCarrinho(b)).IsRequired();

            builder.Property(b => b.DataAtualizacao)
                .HasConversion(
                    b => b.Data,
                    b => new DataUltimaAtualizacaoCarrinho(b)).IsRequired();

            builder.HasOne(b => b.Cliente)
                .WithMany()
                .HasForeignKey("ClienteId")
                .IsRequired();
            

             builder.HasMany(p => p.Itens)
                .WithOne()
                .HasForeignKey("CarrinhoId");      
            
               
            
        }
    }
}