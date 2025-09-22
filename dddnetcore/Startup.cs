using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DDDSample1.Infrastructure;
using System;
using DDDSample1.Domain.Shared;
using dddnetcore.Domain.Produtos;
using dddnetcore.Infraestructure.Produtos;

using dddnetcore.Domain.Categorias;
using dddnetcore.Infraestructure.Categorias;
using dddnetcore.Infraestructure.FotoProdutos;
using dddnetcore.Domain.FotoProdutos;


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
            var connectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseSqlite(connectionString));

                // Adiciona a configuração de CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                // Aqui, define o domínio do frontend que vai poder acessar a API
                policy.WithOrigins("http://localhost:3000")  // Porta do frontend (Vite)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });    

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
            app.UseRouting();

            // Habilita o uso do CORS
            app.UseCors("AllowSpecificOrigin");  // Nome da política que definimos antes

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
            //services.AddTransient<IFotoProdutosRepository, FotoProdutoRepository>();     
            //services.AddTransient<FotoProdutoService>();

        }
    }
}
