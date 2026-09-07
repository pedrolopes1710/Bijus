using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailConfirmation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmado",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TokenConfirmacao",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenConfirmacaoExpira",
                table: "Users",
                type: "datetime2",
                nullable: true);

            // As contas já existentes ficam confirmadas (não bloquear utilizadores/admins atuais).
            // Novos registos de cliente são inseridos explicitamente com EmailConfirmado = 0 pelo EF.
            migrationBuilder.Sql("UPDATE [Users] SET [EmailConfirmado] = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailConfirmado",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TokenConfirmacao",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TokenConfirmacaoExpira",
                table: "Users");
        }
    }
}
