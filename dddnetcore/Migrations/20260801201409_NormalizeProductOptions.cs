using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeProductOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Nome",
                table: "GruposVariantes",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "OpcoesProduto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GrupoVariantesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Ordem = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpcoesProduto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpcoesProduto_GruposVariantes_GrupoVariantesId",
                        column: x => x.GrupoVariantesId,
                        principalTable: "GruposVariantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VariantesProduto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GrupoVariantesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sku = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Preco = table.Column<double>(type: "float", nullable: true),
                    Stock = table.Column<int>(type: "int", nullable: false),
                    Ativa = table.Column<bool>(type: "bit", nullable: false),
                    Ordem = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariantesProduto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariantesProduto_GruposVariantes_GrupoVariantesId",
                        column: x => x.GrupoVariantesId,
                        principalTable: "GruposVariantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ValoresOpcaoProduto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OpcaoProdutoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Valor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CorHex = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Ordem = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresOpcaoProduto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresOpcaoProduto_OpcoesProduto_OpcaoProdutoId",
                        column: x => x.OpcaoProdutoId,
                        principalTable: "OpcoesProduto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VariantesProdutoValores",
                columns: table => new
                {
                    VarianteProdutoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ValorOpcaoProdutoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariantesProdutoValores", x => new { x.VarianteProdutoId, x.ValorOpcaoProdutoId });
                    table.ForeignKey(
                        name: "FK_VariantesProdutoValores_ValoresOpcaoProduto_ValorOpcaoProdutoId",
                        column: x => x.ValorOpcaoProdutoId,
                        principalTable: "ValoresOpcaoProduto",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VariantesProdutoValores_VariantesProduto_VarianteProdutoId",
                        column: x => x.VarianteProdutoId,
                        principalTable: "VariantesProduto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OpcoesProduto_GrupoVariantesId_Nome",
                table: "OpcoesProduto",
                columns: new[] { "GrupoVariantesId", "Nome" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ValoresOpcaoProduto_OpcaoProdutoId_Valor",
                table: "ValoresOpcaoProduto",
                columns: new[] { "OpcaoProdutoId", "Valor" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariantesProduto_GrupoVariantesId",
                table: "VariantesProduto",
                column: "GrupoVariantesId");

            migrationBuilder.CreateIndex(
                name: "IX_VariantesProdutoValores_ValorOpcaoProdutoId",
                table: "VariantesProdutoValores",
                column: "ValorOpcaoProdutoId");

            migrationBuilder.Sql("""
                INSERT INTO OpcoesProduto (Id, GrupoVariantesId, Nome, Ordem)
                SELECT NEWID(), g.Id,
                       COALESCE(JSON_VALUE(o.[value], '$.nome'), JSON_VALUE(o.[value], '$.Nome')),
                       TRY_CONVERT(int, o.[key])
                FROM GruposVariantes g
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(g.Configuracao, '$.opcoes'), JSON_QUERY(g.Configuracao, '$.Opcoes'), N'[]')) o
                WHERE COALESCE(JSON_VALUE(o.[value], '$.nome'), JSON_VALUE(o.[value], '$.Nome')) IS NOT NULL;

                INSERT INTO ValoresOpcaoProduto (Id, OpcaoProdutoId, Valor, CorHex, Ordem)
                SELECT NEWID(), op.Id,
                       COALESCE(JSON_VALUE(val.[value], '$.valor'), JSON_VALUE(val.[value], '$.Valor')),
                       COALESCE(JSON_VALUE(val.[value], '$.corHex'), JSON_VALUE(val.[value], '$.CorHex')),
                       TRY_CONVERT(int, val.[key])
                FROM GruposVariantes g
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(g.Configuracao, '$.opcoes'), JSON_QUERY(g.Configuracao, '$.Opcoes'), N'[]')) o
                JOIN OpcoesProduto op ON op.GrupoVariantesId = g.Id AND op.Ordem = TRY_CONVERT(int, o.[key])
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(o.[value], '$.valores'), JSON_QUERY(o.[value], '$.Valores'), N'[]')) val
                WHERE COALESCE(JSON_VALUE(val.[value], '$.valor'), JSON_VALUE(val.[value], '$.Valor')) IS NOT NULL;

                INSERT INTO VariantesProduto (Id, GrupoVariantesId, Sku, Preco, Stock, Ativa, Ordem)
                SELECT COALESCE(
                           TRY_CONVERT(uniqueidentifier, JSON_VALUE(v.[value], '$.id')),
                           TRY_CONVERT(uniqueidentifier, JSON_VALUE(v.[value], '$.Id')),
                           NEWID()),
                       g.Id,
                       COALESCE(JSON_VALUE(v.[value], '$.sku'), JSON_VALUE(v.[value], '$.Sku'), N''),
                       TRY_CONVERT(float, COALESCE(JSON_VALUE(v.[value], '$.preco'), JSON_VALUE(v.[value], '$.Preco'))),
                       COALESCE(TRY_CONVERT(int, COALESCE(JSON_VALUE(v.[value], '$.stock'), JSON_VALUE(v.[value], '$.Stock'))), 0),
                       CASE WHEN LOWER(COALESCE(JSON_VALUE(v.[value], '$.ativa'), JSON_VALUE(v.[value], '$.Ativa'), N'true')) = N'true' THEN 1 ELSE 0 END,
                       TRY_CONVERT(int, v.[key])
                FROM GruposVariantes g
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(g.Configuracao, '$.variantes'), JSON_QUERY(g.Configuracao, '$.Variantes'), N'[]')) v;

                INSERT INTO VariantesProdutoValores (VarianteProdutoId, ValorOpcaoProdutoId)
                SELECT vp.Id, val.Id
                FROM GruposVariantes g
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(g.Configuracao, '$.variantes'), JSON_QUERY(g.Configuracao, '$.Variantes'), N'[]')) v
                JOIN VariantesProduto vp ON vp.GrupoVariantesId = g.Id AND vp.Ordem = TRY_CONVERT(int, v.[key])
                CROSS APPLY OPENJSON(COALESCE(JSON_QUERY(v.[value], '$.valores'), JSON_QUERY(v.[value], '$.Valores'), N'{}')) escolha
                JOIN OpcoesProduto op ON op.GrupoVariantesId = g.Id AND op.Nome = escolha.[key] COLLATE DATABASE_DEFAULT
                JOIN ValoresOpcaoProduto val ON val.OpcaoProdutoId = op.Id AND val.Valor = escolha.[value] COLLATE DATABASE_DEFAULT;
                """);

            migrationBuilder.DropColumn(
                name: "ConfiguracaoVariantes",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "Configuracao",
                table: "GruposVariantes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VariantesProdutoValores");

            migrationBuilder.DropTable(
                name: "ValoresOpcaoProduto");

            migrationBuilder.DropTable(
                name: "VariantesProduto");

            migrationBuilder.DropTable(
                name: "OpcoesProduto");

            migrationBuilder.AddColumn<string>(
                name: "ConfiguracaoVariantes",
                table: "Produtos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "{\"opcoes\":[],\"variantes\":[]}");

            migrationBuilder.AlterColumn<string>(
                name: "Nome",
                table: "GruposVariantes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AddColumn<string>(
                name: "Configuracao",
                table: "GruposVariantes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
