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
using dddnetcore.Domain.GruposVariantes;
using dddnetcore.Infraestructure.GruposVariantes;
using dddnetcore.Domain.Pagamentos;
using System;
using System.Linq;
using System.Threading;


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
            var connectionString = Configuration.GetConnectionString("DefaultConnection")
                ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                ?? throw new InvalidOperationException("Connection string não configurada.");

            var configuredOrigins = Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            var envOrigins = (Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var allowedOrigins = configuredOrigins.Concat(envOrigins).Distinct().ToArray();

            services.AddDbContext<DDDSample1DbContext>(options =>
                options.UseSqlServer(connectionString));

            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    if (allowedOrigins.Length > 0)
                    {
                        policy.WithOrigins(allowedOrigins)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                    else
                    {
                        policy.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                });
            });

            // JWT CONFIG
            var jwtSecret = Configuration["JwtSettings:Secret"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? throw new InvalidOperationException("JWT secret não configurado.");
            var key = Encoding.ASCII.GetBytes(jwtSecret);

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

            services.AddAuthorization();

            // Serviços da aplicação
            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();
        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (string.Equals(Environment.GetEnvironmentVariable("APPLY_MIGRATIONS"), "true", StringComparison.OrdinalIgnoreCase))
            {
                ApplyDatabaseMigrations(app);
            }

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
            services.AddTransient<IGrupoVariantesRepository, GrupoVariantesRepository>();
            services.AddTransient<GrupoVariantesService>();
            services.AddTransient<StripePagamentoService>();
            services.AddSingleton<dddnetcore.Domain.Emails.IEmailService, dddnetcore.Infraestructure.Emails.EmailService>();
        }

        private static void ApplyDatabaseMigrations(IApplicationBuilder app)
        {
            const int maxAttempts = 20;

            for (var attempt = 1; attempt <= maxAttempts; attempt++)
            {
                try
                {
                    using var scope = app.ApplicationServices.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<DDDSample1DbContext>();
                    db.Database.Migrate();
                    return;
                }
                catch when (attempt < maxAttempts)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(5));
                }
            }
        }
    }
}
