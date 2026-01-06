using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DDDSample1.Infrastructure;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Infraestructure.Produtos;

using dddnetcore.Domain.Categorias;
using dddnetcore.Infraestructure.Categorias;
using dddnetcore.Domain.Clientes;
using dddnetcore.Infraestructure.Clientes;
using Microsoft.EntityFrameworkCore;
using dddnetcore.Domain.Vendas;
using dddnetcore.Infraestructure.Vendas;
using dddnetcore.Domain.VendaProdutos;
using dddnetcore.Infraestructure.VendaProdutos;
using dddnetcore.Domain.ItensCarrinho;
using dddnetcore.Infraestructure.ItensCarrinho;
using dddnetcore.Domain.Carrinhos;
using dddnetcore.Infraestructure.Carrinhos;
using dddnetcore.Domain.Users;
using dddnetcore.Infraestructure.Users;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using dddnetcore.Domain.FotoProdutos;
using dddnetcore.Infraestructure.FotoProdutos;
using dddnetcore.Domain.FotoColecoes;
using dddnetcore.Infraestructure.FotoColecoes;
using dddnetcore.Domain.Colecoes;
using dddnetcore.Infraestructure.Colecoes;


namespace DDDSample1
{

    public class Startup
    {
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")!;
            var allowedOrigins = new[]
            {
                "http://localhost:3000",
                "https://monocyclic-endotrophic-emilie.ngrok-free.dev"
            };  
            services.AddDbContext<DDDSample1DbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")));

            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            // JWT CONFIG
            var key = Encoding.ASCII.GetBytes("ef103f0c234ab2ae5807ac14c6c055f869a785fa06dfac00e96441703b5ca733"); // usa uma chave melhor depois

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Serviços da aplicação
            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();
        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            
            //app.UseHttpsRedirection();
            
            // Serve ficheiros estáticos da pasta wwwroot
            app.UseStaticFiles();
            
            app.UseRouting();

            // Habilita o uso do CORS
            app.UseCors("AllowSpecificOrigin");  // Nome da política que definimos antes
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            //* uteis

            services.AddTransient<IProdutoRepository, ProdutoRepository>();
            services.AddTransient<ProdutoService>();
            services.AddTransient<ICategoriaRepository, CategoriaRepository>();
            services.AddTransient<CategoriaService>();
            services.AddTransient<IFotoProdutosRepository, FotoProdutoRepository>();     
            services.AddTransient<FotoProdutoService>();
            services.AddTransient<IFotoColecaoRepository, FotoColecaoRepository>();
            services.AddTransient<FotoColecaoService>();
            services.AddTransient<IColecaoRepository, ColecaoRepository>();
            services.AddTransient<ColecaoService>();
            services.AddTransient<IClienteRepository, ClienteRepository>();
            services.AddTransient<ClienteService>();
            services.AddTransient<IVendaRepository, VendaRepository>();
            services.AddTransient<VendaService>();
            services.AddTransient<IVendaProdutoRepository, VendaProdutoRepository>();
            services.AddTransient<VendaProdutoService>();
            services.AddTransient<IItemCarrinhoRepository, ItemCarrinhoRepository>();
            services.AddTransient<ItemCarrinhoService>();
            services.AddTransient<ICarrinhoRepository, CarrinhoRepository>();
            services.AddTransient<CarrinhoService>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();
        }
    }
}
