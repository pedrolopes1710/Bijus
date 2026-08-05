using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddVariantGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GrupoVariantesId",
                table: "Produtos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GruposVariantes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Configuracao = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GruposVariantes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_GrupoVariantesId",
                table: "Produtos",
                column: "GrupoVariantesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Produtos_GruposVariantes_GrupoVariantesId",
                table: "Produtos",
                column: "GrupoVariantesId",
                principalTable: "GruposVariantes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Produtos_GruposVariantes_GrupoVariantesId",
                table: "Produtos");

            migrationBuilder.DropTable(
                name: "GruposVariantes");

            migrationBuilder.DropIndex(
                name: "IX_Produtos_GrupoVariantesId",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "GrupoVariantesId",
                table: "Produtos");
        }
    }
}
