using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddVendaTrackingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodigoRastreio",
                table: "Vendas",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataEnvio",
                table: "Vendas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NotasInternas",
                table: "Vendas",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Transportadora",
                table: "Vendas",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UrlRastreio",
                table: "Vendas",
                type: "nvarchar(600)",
                maxLength: 600,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodigoRastreio",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "DataEnvio",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "NotasInternas",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "Transportadora",
                table: "Vendas");

            migrationBuilder.DropColumn(
                name: "UrlRastreio",
                table: "Vendas");
        }
    }
}
