using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class ALL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contratos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false),
                    Salario = table.Column<double>(type: "REAL", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contratos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Families",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Families", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CategoryId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projetos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    NomeProjeto = table.Column<string>(type: "TEXT", nullable: true),
                    DescricaoProjeto = table.Column<string>(type: "TEXT", nullable: true),
                    PessoaId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projetos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rubricas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rubricas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TiposEntregavel",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposEntregavel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TiposVinculo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposVinculo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pessoas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    CienciaId = table.Column<string>(type: "TEXT", nullable: false),
                    UltimoPedidoPagamento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ContratoId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Ativo = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pessoas_Contratos_ContratoId",
                        column: x => x.ContratoId,
                        principalTable: "Contratos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Atividades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataFimAtividade = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataInicioAtividade = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DescricaoAtividade = table.Column<string>(type: "TEXT", nullable: false),
                    NomeAtividade = table.Column<string>(type: "TEXT", nullable: false),
                    ProjetoId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Atividades_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Indicadores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    NomeIndicador = table.Column<string>(type: "TEXT", nullable: true),
                    ValorAtual = table.Column<double>(type: "REAL", nullable: true),
                    ValorMaximo = table.Column<double>(type: "REAL", nullable: true),
                    ProjetoId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Indicadores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Indicadores_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CargasMensais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    JornadaDiaria = table.Column<double>(type: "REAL", nullable: false),
                    DiasUteis = table.Column<double>(type: "REAL", nullable: false),
                    Ausencias = table.Column<double>(type: "REAL", nullable: false),
                    SalarioBase = table.Column<double>(type: "REAL", nullable: false),
                    MesAno = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TSU = table.Column<double>(type: "REAL", nullable: false),
                    PessoaId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CargasMensais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CargasMensais_Pessoas_PessoaId",
                        column: x => x.PessoaId,
                        principalTable: "Pessoas",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PessoaProjeto",
                columns: table => new
                {
                    PessoasId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjetosId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PessoaProjeto", x => new { x.PessoasId, x.ProjetosId });
                    table.ForeignKey(
                        name: "FK_PessoaProjeto_Pessoas_PessoasId",
                        column: x => x.PessoasId,
                        principalTable: "Pessoas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PessoaProjeto_Projetos_ProjetosId",
                        column: x => x.ProjetosId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Entregaveis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TipoEntregavelId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AtividadeId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entregaveis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Entregaveis_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Entregaveis_TiposEntregavel_TipoEntregavelId",
                        column: x => x.TipoEntregavelId,
                        principalTable: "TiposEntregavel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orcamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    GastoPlaneado = table.Column<double>(type: "REAL", nullable: false),
                    RubricaId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AtividadeId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orcamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orcamentos_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Orcamentos_Rubricas_RubricaId",
                        column: x => x.RubricaId,
                        principalTable: "Rubricas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Perfil",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PMsTotais = table.Column<int>(type: "INTEGER", nullable: false),
                    DescricaoPerfil = table.Column<string>(type: "TEXT", nullable: false),
                    TipoVinculoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AtividadeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ProjetoId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Perfil", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Perfil_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Perfil_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Perfil_TiposVinculo_TipoVinculoId",
                        column: x => x.TipoVinculoId,
                        principalTable: "TiposVinculo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    NomeTarefa = table.Column<string>(type: "TEXT", nullable: false),
                    DescricaoTarefa = table.Column<string>(type: "TEXT", nullable: false),
                    StatusTarefa = table.Column<string>(type: "TEXT", nullable: false),
                    AtividadeId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarefas_Atividades_AtividadeId",
                        column: x => x.AtividadeId,
                        principalTable: "Atividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Despesas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    Valor = table.Column<double>(type: "REAL", nullable: false),
                    CargaMensalId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Automatico = table.Column<bool>(type: "INTEGER", nullable: false),
                    OrcamentoId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Despesas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Despesas_CargasMensais_CargaMensalId",
                        column: x => x.CargaMensalId,
                        principalTable: "CargasMensais",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Despesas_Orcamentos_OrcamentoId",
                        column: x => x.OrcamentoId,
                        principalTable: "Orcamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AfetacaoPerfis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DuracaoMes = table.Column<int>(type: "INTEGER", nullable: false),
                    PMsAprovados = table.Column<double>(type: "REAL", nullable: false),
                    PerfilId = table.Column<Guid>(type: "TEXT", nullable: true),
                    PessoaId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AfetacaoPerfis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AfetacaoPerfis_Perfil_PerfilId",
                        column: x => x.PerfilId,
                        principalTable: "Perfil",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AfetacaoPerfis_Pessoas_PessoaId",
                        column: x => x.PessoaId,
                        principalTable: "Pessoas",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AfetacaoMensais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PMs = table.Column<double>(type: "REAL", nullable: false),
                    AfetacaoPerfilId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CargaMensalId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AfetacaoMensais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AfetacaoMensais_AfetacaoPerfis_AfetacaoPerfilId",
                        column: x => x.AfetacaoPerfilId,
                        principalTable: "AfetacaoPerfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AfetacaoMensais_CargasMensais_CargaMensalId",
                        column: x => x.CargaMensalId,
                        principalTable: "CargasMensais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AfetacaoMensais_AfetacaoPerfilId",
                table: "AfetacaoMensais",
                column: "AfetacaoPerfilId");

            migrationBuilder.CreateIndex(
                name: "IX_AfetacaoMensais_CargaMensalId",
                table: "AfetacaoMensais",
                column: "CargaMensalId");

            migrationBuilder.CreateIndex(
                name: "IX_AfetacaoPerfis_PerfilId",
                table: "AfetacaoPerfis",
                column: "PerfilId");

            migrationBuilder.CreateIndex(
                name: "IX_AfetacaoPerfis_PessoaId",
                table: "AfetacaoPerfis",
                column: "PessoaId");

            migrationBuilder.CreateIndex(
                name: "IX_Atividades_ProjetoId",
                table: "Atividades",
                column: "ProjetoId");

            migrationBuilder.CreateIndex(
                name: "IX_CargasMensais_PessoaId",
                table: "CargasMensais",
                column: "PessoaId");

            migrationBuilder.CreateIndex(
                name: "IX_Despesas_CargaMensalId",
                table: "Despesas",
                column: "CargaMensalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Despesas_OrcamentoId",
                table: "Despesas",
                column: "OrcamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Entregaveis_AtividadeId",
                table: "Entregaveis",
                column: "AtividadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Entregaveis_TipoEntregavelId",
                table: "Entregaveis",
                column: "TipoEntregavelId");

            migrationBuilder.CreateIndex(
                name: "IX_Indicadores_ProjetoId",
                table: "Indicadores",
                column: "ProjetoId");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_AtividadeId",
                table: "Orcamentos",
                column: "AtividadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_RubricaId",
                table: "Orcamentos",
                column: "RubricaId");

            migrationBuilder.CreateIndex(
                name: "IX_Perfil_AtividadeId",
                table: "Perfil",
                column: "AtividadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Perfil_ProjetoId",
                table: "Perfil",
                column: "ProjetoId");

            migrationBuilder.CreateIndex(
                name: "IX_Perfil_TipoVinculoId",
                table: "Perfil",
                column: "TipoVinculoId");

            migrationBuilder.CreateIndex(
                name: "IX_PessoaProjeto_ProjetosId",
                table: "PessoaProjeto",
                column: "ProjetosId");

            migrationBuilder.CreateIndex(
                name: "IX_Pessoas_CienciaId",
                table: "Pessoas",
                column: "CienciaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pessoas_ContratoId",
                table: "Pessoas",
                column: "ContratoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_AtividadeId",
                table: "Tarefas",
                column: "AtividadeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AfetacaoMensais");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Despesas");

            migrationBuilder.DropTable(
                name: "Entregaveis");

            migrationBuilder.DropTable(
                name: "Families");

            migrationBuilder.DropTable(
                name: "Indicadores");

            migrationBuilder.DropTable(
                name: "PessoaProjeto");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "AfetacaoPerfis");

            migrationBuilder.DropTable(
                name: "CargasMensais");

            migrationBuilder.DropTable(
                name: "Orcamentos");

            migrationBuilder.DropTable(
                name: "TiposEntregavel");

            migrationBuilder.DropTable(
                name: "Perfil");

            migrationBuilder.DropTable(
                name: "Pessoas");

            migrationBuilder.DropTable(
                name: "Rubricas");

            migrationBuilder.DropTable(
                name: "Atividades");

            migrationBuilder.DropTable(
                name: "TiposVinculo");

            migrationBuilder.DropTable(
                name: "Contratos");

            migrationBuilder.DropTable(
                name: "Projetos");
        }
    }
}
