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
            builder.Property(b => b.UserName)
                .HasConversion(
                    b => b.Nome,
                    b => new UserName(b)).IsRequired();

            builder.Property(b => b.UserPassword)
                .HasConversion(
                    b => b.Password,
                    b => new UserPassword(b)).IsRequired();

            builder.HasOne(b => b.Cliente)
                .WithMany()
                .HasForeignKey("ClienteId")
                .IsRequired();
            
        }
    }
}