using Microsoft.EntityFrameworkCore;
using System;
using dddnetcore.Domain.Produtos;


namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        //uteis

        public DbSet<Produto> Produtos { get; set; }

        
        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // uteis
            modelBuilder.ApplyConfiguration(new ProdutoEntityTypeConfiguration());

        }
    }
}