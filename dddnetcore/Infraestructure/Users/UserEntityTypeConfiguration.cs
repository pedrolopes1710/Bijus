using dddnetcore.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dddnetcore.Infraestructure.Users
{
    
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .HasConversion(
                    id => id.AsGuid(), 
                    guid => new UserId(guid));
            builder.OwnsOne(b => b.UserName, un =>
            {
                un.Property(p => p.Nome)
                  .HasColumnName("UserName")
                  .HasMaxLength(100)
                  .IsRequired();
            });

            // Mapear UserPassword como owned type -> coluna "PasswordHash"
            builder.OwnsOne(b => b.UserPassword, up =>
            {
                up.Property(p => p.Password)
                  .HasColumnName("PasswordHash")
                  .IsRequired();
            });

            builder.HasOne(b => b.Cliente)
                .WithMany()
                .HasForeignKey("ClienteId")
                .IsRequired();
            
        }
    }
}