using dddnetcore.Domain.Produtos;
using dddnetcore.Infraestructure.Produtos;
using dddnetcore.Infraestructure.Categorias;
using dddnetcore.Domain.Categorias;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Infraestructure.FotoProdutos;
using dddnetcore.Domain.Clientes;
using dddnetcore.Infraestructure.Clientes;
using dddnetcore.Domain.Vendas;
using dddnetcore.Infraestructure.Vendas;
using Microsoft.EntityFrameworkCore;
using dddnetcore.Domain.VendaProdutos;
using dddnetcore.Infraestructure.VendaProdutos;
using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Infraestructure.ItensCarrinho;
using dddnetcore.Domain.Carrinhos;
using dddnetcore.Infraestructure.Carrinhos;
using dddnetcore.Infraestructure.Users;
using dddnetcore.Domain.Users;
using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Infraestructure.FotoColecoes;
using dddnetcore.Domain.Colecoes;
using dddnetcore.Infraestructure.Colecoes;
using dddnetcore.Domain.GruposVariantes;
using dddnetcore.Infraestructure.GruposVariantes;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        //uteis

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<FotoProduto> FotoProdutos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Venda> Vendas { get; set; }
        public DbSet<VendaProduto> VendaProdutos { get; set; }
        public DbSet<ItemCarrinho> ItensCarrinho { get; set; }
        public DbSet<Carrinho> Carrinhos { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<FotoColecao> FotoColecoes { get; set; }
        public DbSet<Colecao> Colecoes { get; set; }
        public DbSet<GrupoVariantes> GruposVariantes { get; set; }
        public DbSet<OpcaoProduto> OpcoesProduto { get; set; }
        public DbSet<ValorOpcaoProduto> ValoresOpcaoProduto { get; set; }
        public DbSet<VarianteProduto> VariantesProduto { get; set; }
        public DbSet<VarianteProdutoValor> VariantesProdutoValores { get; set; }
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
            modelBuilder.ApplyConfiguration(new VendaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VendaProdutoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ItemCarrinhoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CarrinhoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FotoColecaoEntityTypeConfiguration());  
            modelBuilder.ApplyConfiguration(new ColecaoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new GrupoVariantesEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OpcaoProdutoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ValorOpcaoProdutoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VarianteProdutoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VarianteProdutoValorEntityTypeConfiguration());
        }
    }
}
