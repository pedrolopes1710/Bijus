using dddnetcore.Domain.Carrinhos;
using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Domain.Produtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;



namespace dddnetcore.Infraestructure.ItensCarrinho
{
    public class ItemCarrinhoEntityTypeConfiguration : IEntityTypeConfiguration<ItemCarrinho>
    {
        public void Configure(EntityTypeBuilder<ItemCarrinho> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new ItemCarrinhoId(guid));

            builder.Property(b => b.Quantidade)
                .HasConversion(
                    b => b.Value,
                    b => new Quantidade(b)).IsRequired();

            builder.HasOne(b => b.Produto)
                .WithMany()
                .HasForeignKey("ProdutoId")
                .IsRequired();
            
            builder.HasOne<Carrinho>()
                .WithMany(p => p.Itens)
                .HasForeignKey("CarrinhoId")
                .IsRequired(false);
        }
    }
}
