using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddStripeMbWayPayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetodoPagamento",
                table: "Vendas",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PagamentoEstado",
                table: "Vendas",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PagamentoProvider",
                table: "Vendas",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PagamentoReferencia",
                table: "Vendas",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MetodoPagamento",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "PagamentoEstado",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "PagamentoProvider",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "PagamentoReferencia",
                table: "Vendas");
        }
    }
}
