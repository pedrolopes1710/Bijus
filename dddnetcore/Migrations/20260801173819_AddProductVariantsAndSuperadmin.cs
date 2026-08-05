using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariantsAndSuperadmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DetalhesVariante",
                table: "VendaProdutos",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConfiguracaoVariantes",
                table: "Produtos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "{\"opcoes\":[],\"variantes\":[]}");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DetalhesVariante",
                table: "VendaProdutos");

            migrationBuilder.DropColumn(
                name: "ConfiguracaoVariantes",
                table: "Produtos");
        }
    }
}
