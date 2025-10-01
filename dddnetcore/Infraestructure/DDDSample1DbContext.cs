using Microsoft.EntityFrameworkCore;
using System;
using dddnetcore.Domain.Produtos;
using dddnetcore.Infraestructure.Produtos;
using dddnetcore.Infraestructure.Categorias;
using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Infraestructure.FotoProdutos;
using dddnetcore.Domain.Clientes;
using dddnetcore.Infraestructure.Clientes;


namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        //uteis

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<FotoProduto> FotoProdutos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        
        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // uteis
            modelBuilder.ApplyConfiguration(new ProdutoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CategoriaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FotoProdutoEntityTypeConfiguration());  
            modelBuilder.ApplyConfiguration(new ClienteEntityTypeConfiguration());

        }
    }
}