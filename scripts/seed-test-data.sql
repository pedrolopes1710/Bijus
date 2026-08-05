SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

-- Este script repoe integralmente os dados de demonstracao. Nao usar numa base de producao.
DELETE FROM VendaProdutos;
DELETE FROM ItensCarrinho;
DELETE FROM Vendas;
DELETE FROM Carrinhos;
DELETE FROM FotoProdutos;
DELETE FROM Produtos;
DELETE FROM GruposVariantes;
DELETE FROM FotoColecoes;
DELETE FROM Colecoes;
DELETE FROM Categorias;

DECLARE @catQuadros uniqueidentifier = '11000000-0000-0000-0000-000000000001';
DECLARE @catCanecas uniqueidentifier = '11000000-0000-0000-0000-000000000002';
DECLARE @catLouca uniqueidentifier = '11000000-0000-0000-0000-000000000003';
DECLARE @catImanes uniqueidentifier = '11000000-0000-0000-0000-000000000004';
DECLARE @catBrincos uniqueidentifier = '11000000-0000-0000-0000-000000000005';
DECLARE @catPortaChaves uniqueidentifier = '11000000-0000-0000-0000-000000000006';
DECLARE @catVinho uniqueidentifier = '11000000-0000-0000-0000-000000000007';
DECLARE @catDecoracao uniqueidentifier = '11000000-0000-0000-0000-000000000008';

INSERT INTO Categorias (Id, NomeCategoria) VALUES
(@catQuadros, N'Quadros artesanais'),
(@catCanecas, N'Canecas'),
(@catLouca, N'Louça artesanal'),
(@catImanes, N'Ímanes'),
(@catBrincos, N'Brincos'),
(@catPortaChaves, N'Porta-chaves'),
(@catVinho, N'Acessórios de vinho'),
(@catDecoracao, N'Decoração');

DECLARE @colFeira uniqueidentifier = '12000000-0000-0000-0000-000000000001';
DECLARE @colAmigos uniqueidentifier = '12000000-0000-0000-0000-000000000002';

INSERT INTO Colecoes (Id, NomeColecao, DescricaoColecao, DataAtualizacaoColecao, DataCriacaoColecao, EstadoColecao) VALUES
(@colFeira, N'Feira do Vinho', N'Peças de biscuit inspiradas na Feira do Vinho e em Castelo de Paiva.', SYSUTCDATETIME(), SYSUTCDATETIME(), 0),
(@colAmigos, N'Amigos à Mesa', N'Quadros artesanais que celebram amizade, vinho e bons momentos.', SYSUTCDATETIME(), SYSUTCDATETIME(), 0);

INSERT INTO FotoColecoes (Id, UrlColecao, ColecaoId) VALUES
(NEWID(), N'/uploads/produtos/feira-caneca-02.jpeg', @colFeira),
(NEWID(), N'/uploads/produtos/feira-quadro-amigos.jpeg', @colAmigos);

DECLARE @produtos TABLE (
    Id uniqueidentifier PRIMARY KEY,
    Nome nvarchar(max),
    Descricao nvarchar(max),
    Preco float,
    Stock int,
    CategoriaId uniqueidentifier,
    ColecaoId uniqueidentifier,
    Configuracao nvarchar(max)
);

INSERT INTO @produtos VALUES
('10000000-0000-0000-0000-000000000001', N'Quadro Melhores Vinhos', N'Quadro artesanal com duas figuras, rolhas naturais e a frase “Melhores vinhos são aqueles que partilhamos com os amigos”.', 28.90, 4, @catQuadros, @colAmigos, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000002', N'Caneca Feira do Vinho', N'Caneca branca decorada à mão com videiras, uvas e referência a Castelo de Paiva.', 24.90, 6, @catCanecas, @colFeira, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000003', N'Quadro Amigos e Vinho', N'Quadro artesanal com rolhas naturais e a frase “Os amigos são o vinho da vida”.', 24.90, 4, @catQuadros, @colAmigos, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000004', N'Taça Feira do Vinho com Uvas', N'Taça em cerâmica decorada à mão com um cacho de uvas e placa Feira do Vinho.', 19.90, 12, @catLouca, @colFeira, N'{"opcoes":[{"nome":"Cor das uvas","valores":[{"valor":"Roxo","corHex":"#7b2d68"},{"valor":"Rosa","corHex":"#c13f7a"},{"valor":"Verde","corHex":"#75a843"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000001","sku":"TACA-ROXO","valores":{"Cor das uvas":"Roxo"},"preco":19.9,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000002","sku":"TACA-ROSA","valores":{"Cor das uvas":"Rosa"},"preco":19.9,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000003","sku":"TACA-VERDE","valores":{"Cor das uvas":"Verde"},"preco":19.9,"stock":4,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000005', N'Íman Placa Feira do Vinho', N'Íman artesanal com garrafa, uvas e elementos de Castelo de Paiva.', 6.50, 16, @catImanes, @colFeira, N'{"opcoes":[{"nome":"Modelo","valores":[{"valor":"Faixa branca"},{"valor":"Placa clássica"},{"valor":"Copo e uvas"},{"valor":"Barrica"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000011","sku":"IMAN-PLACA-1","valores":{"Modelo":"Faixa branca"},"preco":6.5,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000012","sku":"IMAN-PLACA-2","valores":{"Modelo":"Placa clássica"},"preco":6.5,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000013","sku":"IMAN-PLACA-3","valores":{"Modelo":"Copo e uvas"},"preco":6.5,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000014","sku":"IMAN-PLACA-4","valores":{"Modelo":"Barrica"},"preco":6.5,"stock":4,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000006', N'Íman Cesto de Vinhos', N'Íman em biscuit com cesto artesanal, garrafas e cacho de uvas.', 7.90, 8, @catImanes, @colFeira, N'{"opcoes":[{"nome":"Modelo","valores":[{"valor":"Cesto com uvas roxas"},{"valor":"Cesto com uvas vermelhas"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000021","sku":"IMAN-CESTO-ROXO","valores":{"Modelo":"Cesto com uvas roxas"},"preco":7.9,"stock":4,"ativa":true},{"id":"40000000-0000-0000-0000-000000000022","sku":"IMAN-CESTO-VERMELHO","valores":{"Modelo":"Cesto com uvas vermelhas"},"preco":7.9,"stock":4,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000007', N'Íman Duas Garrafas', N'Íman artesanal com duas garrafas e referências à Feira do Vinho e a Castelo de Paiva.', 6.90, 8, @catImanes, @colFeira, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000008', N'Brincos Sardinhas', N'Brincos leves em biscuit com sardinhas modeladas e pintadas à mão.', 9.90, 10, @catBrincos, @colFeira, N'{"opcoes":[{"nome":"Cor","valores":[{"valor":"Prateado","corHex":"#8c8fa0"},{"valor":"Dourado","corHex":"#8a7449"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000031","sku":"BR-SARD-PRATA","valores":{"Cor":"Prateado"},"preco":9.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000032","sku":"BR-SARD-DOURADO","valores":{"Cor":"Dourado"},"preco":9.9,"stock":5,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000009', N'Brincos Cachos de Uvas', N'Brincos em forma de pequenos cachos de uvas, disponíveis em várias cores.', 10.90, 25, @catBrincos, @colFeira, N'{"opcoes":[{"nome":"Cor","valores":[{"valor":"Roxo","corHex":"#7651a3"},{"valor":"Verde claro","corHex":"#b6c967"},{"valor":"Amarelo","corHex":"#e5ca2b"},{"valor":"Verde","corHex":"#62ad69"},{"valor":"Vermelho","corHex":"#b94c38"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000041","sku":"BR-UVA-ROXO","valores":{"Cor":"Roxo"},"preco":10.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000042","sku":"BR-UVA-VCLARO","valores":{"Cor":"Verde claro"},"preco":10.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000043","sku":"BR-UVA-AMARELO","valores":{"Cor":"Amarelo"},"preco":10.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000044","sku":"BR-UVA-VERDE","valores":{"Cor":"Verde"},"preco":10.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000045","sku":"BR-UVA-VERMELHO","valores":{"Cor":"Vermelho"},"preco":10.9,"stock":5,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000010', N'Íman Folhas de Videira', N'Íman artesanal com folhas de videira modeladas e pintadas à mão.', 6.50, 10, @catImanes, @colFeira, N'{"opcoes":[{"nome":"Cor da base","valores":[{"valor":"Amarelo","corHex":"#d7c83b"},{"valor":"Verde","corHex":"#6b9b4f"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000051","sku":"IMAN-FOLHA-AM","valores":{"Cor da base":"Amarelo"},"preco":6.5,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000052","sku":"IMAN-FOLHA-VD","valores":{"Cor da base":"Verde"},"preco":6.5,"stock":5,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000011', N'Porta-chaves Barril Feira do Vinho', N'Porta-chaves em forma de barril com etiqueta Feira do Vinho.', 8.90, 15, @catPortaChaves, @colFeira, N'{"opcoes":[{"nome":"Cor da etiqueta","valores":[{"valor":"Madeira","corHex":"#ad7448"},{"valor":"Rosa","corHex":"#d04b75"},{"valor":"Amarelo","corHex":"#d3b63c"}]}],"variantes":[{"id":"40000000-0000-0000-0000-000000000061","sku":"PCH-BARRIL-MAD","valores":{"Cor da etiqueta":"Madeira"},"preco":8.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000062","sku":"PCH-BARRIL-ROSA","valores":{"Cor da etiqueta":"Rosa"},"preco":8.9,"stock":5,"ativa":true},{"id":"40000000-0000-0000-0000-000000000063","sku":"PCH-BARRIL-AM","valores":{"Cor da etiqueta":"Amarelo"},"preco":8.9,"stock":5,"ativa":true}]}'),
('10000000-0000-0000-0000-000000000012', N'Saca-rolhas Feira do Vinho', N'Saca-rolhas de alavanca decorado à mão com placa Feira do Vinho.', 14.90, 5, @catVinho, @colFeira, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000013', N'Saca-rolhas Castelo de Paiva', N'Saca-rolhas com cabo decorado em efeito madeira e inscrição Castelo de Paiva.', 12.90, 5, @catVinho, @colFeira, N'{"opcoes":[],"variantes":[]}'),
('10000000-0000-0000-0000-000000000014', N'Garrafa Decorativa Feira do Vinho', N'Garrafa decorativa revestida em efeito madeira, com etiqueta Feira do Vinho e Castelo de Paiva.', 18.90, 3, @catDecoracao, @colFeira, N'{"opcoes":[],"variantes":[]}');

INSERT INTO Produtos (Id, NomeProduto, DescricaoProduto, PrecoProduto, StockProduto, CategoriaId, ColecaoId)
SELECT Id, Nome, Descricao, Preco, Stock, CategoriaId, ColecaoId FROM @produtos;

DECLARE @grupoTaca uniqueidentifier = '13000000-0000-0000-0000-000000000001';
DECLARE @grupoImanPlaca uniqueidentifier = '13000000-0000-0000-0000-000000000002';
DECLARE @grupoImanCesto uniqueidentifier = '13000000-0000-0000-0000-000000000003';
DECLARE @grupoSardinhas uniqueidentifier = '13000000-0000-0000-0000-000000000004';
DECLARE @grupoUvas uniqueidentifier = '13000000-0000-0000-0000-000000000005';
DECLARE @grupoFolhas uniqueidentifier = '13000000-0000-0000-0000-000000000006';
DECLARE @grupoPortaChaves uniqueidentifier = '13000000-0000-0000-0000-000000000007';

DECLARE @grupos TABLE (Id uniqueidentifier, Nome nvarchar(120), ProdutoId uniqueidentifier);
INSERT INTO @grupos VALUES
(@grupoTaca, N'Cores das uvas da taça', '10000000-0000-0000-0000-000000000004'),
(@grupoImanPlaca, N'Modelos de íman placa', '10000000-0000-0000-0000-000000000005'),
(@grupoImanCesto, N'Modelos de íman cesto', '10000000-0000-0000-0000-000000000006'),
(@grupoSardinhas, N'Cores dos brincos sardinha', '10000000-0000-0000-0000-000000000008'),
(@grupoUvas, N'Cores dos brincos uvas', '10000000-0000-0000-0000-000000000009'),
(@grupoFolhas, N'Cores da base com folhas', '10000000-0000-0000-0000-000000000010'),
(@grupoPortaChaves, N'Cores da etiqueta do porta-chaves', '10000000-0000-0000-0000-000000000011');

INSERT INTO GruposVariantes (Id, Nome) SELECT Id, Nome FROM @grupos;

INSERT INTO OpcoesProduto (Id, GrupoVariantesId, Nome, Ordem)
SELECT NEWID(), g.Id, JSON_VALUE(o.[value], '$.nome'), TRY_CONVERT(int, o.[key])
FROM @grupos g JOIN @produtos p ON p.Id = g.ProdutoId
CROSS APPLY OPENJSON(JSON_QUERY(p.Configuracao, '$.opcoes')) o;

INSERT INTO ValoresOpcaoProduto (Id, OpcaoProdutoId, Valor, CorHex, Ordem)
SELECT NEWID(), op.Id, JSON_VALUE(v.[value], '$.valor'), JSON_VALUE(v.[value], '$.corHex'), TRY_CONVERT(int, v.[key])
FROM @grupos g JOIN @produtos p ON p.Id = g.ProdutoId
CROSS APPLY OPENJSON(JSON_QUERY(p.Configuracao, '$.opcoes')) o
JOIN OpcoesProduto op ON op.GrupoVariantesId = g.Id AND op.Ordem = TRY_CONVERT(int, o.[key])
CROSS APPLY OPENJSON(JSON_QUERY(o.[value], '$.valores')) v;

INSERT INTO VariantesProduto (Id, GrupoVariantesId, Sku, Preco, Stock, Ativa, Ordem)
SELECT TRY_CONVERT(uniqueidentifier, JSON_VALUE(v.[value], '$.id')), g.Id, JSON_VALUE(v.[value], '$.sku'),
       TRY_CONVERT(float, JSON_VALUE(v.[value], '$.preco')), TRY_CONVERT(int, JSON_VALUE(v.[value], '$.stock')),
       CASE WHEN JSON_VALUE(v.[value], '$.ativa') = 'true' THEN 1 ELSE 0 END, TRY_CONVERT(int, v.[key])
FROM @grupos g JOIN @produtos p ON p.Id = g.ProdutoId
CROSS APPLY OPENJSON(JSON_QUERY(p.Configuracao, '$.variantes')) v;

INSERT INTO VariantesProdutoValores (VarianteProdutoId, ValorOpcaoProdutoId)
SELECT variante.Id, valor.Id
FROM @grupos g JOIN @produtos p ON p.Id = g.ProdutoId
CROSS APPLY OPENJSON(JSON_QUERY(p.Configuracao, '$.variantes')) v
JOIN VariantesProduto variante ON variante.GrupoVariantesId = g.Id AND variante.Ordem = TRY_CONVERT(int, v.[key])
CROSS APPLY OPENJSON(JSON_QUERY(v.[value], '$.valores')) escolha
JOIN OpcoesProduto opcao ON opcao.GrupoVariantesId = g.Id AND opcao.Nome = escolha.[key] COLLATE DATABASE_DEFAULT
JOIN ValoresOpcaoProduto valor ON valor.OpcaoProdutoId = opcao.Id AND valor.Valor = escolha.[value] COLLATE DATABASE_DEFAULT;

UPDATE Produtos SET GrupoVariantesId = @grupoTaca WHERE Id = '10000000-0000-0000-0000-000000000004';
UPDATE Produtos SET GrupoVariantesId = @grupoImanPlaca WHERE Id = '10000000-0000-0000-0000-000000000005';
UPDATE Produtos SET GrupoVariantesId = @grupoImanCesto WHERE Id = '10000000-0000-0000-0000-000000000006';
UPDATE Produtos SET GrupoVariantesId = @grupoSardinhas WHERE Id = '10000000-0000-0000-0000-000000000008';
UPDATE Produtos SET GrupoVariantesId = @grupoUvas WHERE Id = '10000000-0000-0000-0000-000000000009';
UPDATE Produtos SET GrupoVariantesId = @grupoFolhas WHERE Id = '10000000-0000-0000-0000-000000000010';
UPDATE Produtos SET GrupoVariantesId = @grupoPortaChaves WHERE Id = '10000000-0000-0000-0000-000000000011';

DECLARE @fotos TABLE (ProdutoId uniqueidentifier, Url nvarchar(max), Ordem int);
INSERT INTO @fotos VALUES
('10000000-0000-0000-0000-000000000001', N'/uploads/produtos/feira-quadro-melhores-vinhos.jpeg', 1),
('10000000-0000-0000-0000-000000000002', N'/uploads/produtos/feira-caneca-02.jpeg', 1),
('10000000-0000-0000-0000-000000000002', N'/uploads/produtos/feira-caneca-01.jpeg', 2),
('10000000-0000-0000-0000-000000000002', N'/uploads/produtos/feira-caneca-03.jpeg', 3),
('10000000-0000-0000-0000-000000000003', N'/uploads/produtos/feira-quadro-amigos.jpeg', 1),
('10000000-0000-0000-0000-000000000004', N'/uploads/produtos/feira-taca-uvas-01.jpeg', 1),
('10000000-0000-0000-0000-000000000004', N'/uploads/produtos/feira-taca-uvas-02.jpeg', 2),
('10000000-0000-0000-0000-000000000004', N'/uploads/produtos/feira-taca-uvas-03.jpeg', 3),
('10000000-0000-0000-0000-000000000004', N'/uploads/produtos/feira-taca-uvas-04.jpeg', 4),
('10000000-0000-0000-0000-000000000005', N'/uploads/produtos/feira-iman-placa-01.jpeg', 1),
('10000000-0000-0000-0000-000000000005', N'/uploads/produtos/feira-iman-placa-02.jpeg', 2),
('10000000-0000-0000-0000-000000000005', N'/uploads/produtos/feira-iman-placa-03.jpeg', 3),
('10000000-0000-0000-0000-000000000005', N'/uploads/produtos/feira-iman-placa-04.jpeg', 4),
('10000000-0000-0000-0000-000000000006', N'/uploads/produtos/feira-iman-cesto-01.jpeg', 1),
('10000000-0000-0000-0000-000000000006', N'/uploads/produtos/feira-iman-cesto-02.jpeg', 2),
('10000000-0000-0000-0000-000000000007', N'/uploads/produtos/feira-iman-garrafas.jpeg', 1),
('10000000-0000-0000-0000-000000000008', N'/uploads/produtos/feira-brincos-sardinhas.jpeg', 1),
('10000000-0000-0000-0000-000000000009', N'/uploads/produtos/feira-brincos-uvas-01.jpeg', 1),
('10000000-0000-0000-0000-000000000009', N'/uploads/produtos/feira-conjunto-variantes.jpeg', 2),
('10000000-0000-0000-0000-000000000010', N'/uploads/produtos/feira-iman-folhas.jpeg', 1),
('10000000-0000-0000-0000-000000000010', N'/uploads/produtos/feira-conjunto-variantes.jpeg', 2),
('10000000-0000-0000-0000-000000000011', N'/uploads/produtos/feira-porta-chaves-01.jpeg', 1),
('10000000-0000-0000-0000-000000000011', N'/uploads/produtos/feira-porta-chaves-02.jpeg', 2),
('10000000-0000-0000-0000-000000000011', N'/uploads/produtos/feira-porta-chaves-03.jpeg', 3),
('10000000-0000-0000-0000-000000000011', N'/uploads/produtos/feira-porta-chaves-04.jpeg', 4),
('10000000-0000-0000-0000-000000000012', N'/uploads/produtos/feira-saca-rolhas-alavanca.jpeg', 1),
('10000000-0000-0000-0000-000000000013', N'/uploads/produtos/feira-saca-rolhas-cabo-01.jpeg', 1),
('10000000-0000-0000-0000-000000000013', N'/uploads/produtos/feira-saca-rolhas-cabo-02.jpeg', 2),
('10000000-0000-0000-0000-000000000014', N'/uploads/produtos/feira-garrafa-decorativa.jpeg', 1);

INSERT INTO FotoProdutos (Id, UrlProduto, ProdutoId)
SELECT NEWID(), Url, ProdutoId FROM @fotos ORDER BY ProdutoId, Ordem;

DECLARE @passwordHash nvarchar(max) = N'$2a$11$rDEPbhwkf3iP4UT/TAadZOiQ.iXP9/nrrA5bikviTFZceXoNtdRaO'; -- teste123
DECLARE @clienteTeste uniqueidentifier = '99999999-9999-9999-9999-999999999999';
DECLARE @clienteAdmin uniqueidentifier = '99999999-9999-9999-9999-999999999998';
DECLARE @clienteSuper uniqueidentifier = '99999999-9999-9999-9999-999999999997';

MERGE Clientes AS target USING (VALUES
(@clienteTeste, N'Cliente Teste', N'teste@bijus.local', N'Castelo de Paiva, Portugal'),
(@clienteAdmin, N'Administrador', N'admin@biscuitarte.shop', N'Backoffice'),
(@clienteSuper, N'Superadministrador', N'superadmin@biscuitarte.shop', N'Backoffice')
) AS source(Id, Nome, Email, Morada) ON target.Id = source.Id
WHEN MATCHED THEN UPDATE SET NomeCliente=source.Nome, EmailCliente=source.Email, MoradaCliente=source.Morada
WHEN NOT MATCHED THEN INSERT (Id, NomeCliente, EmailCliente, MoradaCliente) VALUES(source.Id, source.Nome, source.Email, source.Morada);

MERGE [Users] AS target USING (VALUES
('aaaaaaaa-9999-9999-9999-999999999999', N'teste', @passwordHash, @clienteTeste, N'cliente'),
('aaaaaaaa-9999-9999-9999-999999999998', N'admin', @passwordHash, @clienteAdmin, N'admin'),
('aaaaaaaa-9999-9999-9999-999999999997', N'superadmin', @passwordHash, @clienteSuper, N'superadmin')
) AS source(Id, UserName, PasswordHash, ClienteId, [Role]) ON target.Id = source.Id
WHEN MATCHED THEN UPDATE SET UserName=source.UserName, PasswordHash=source.PasswordHash, ClienteId=source.ClienteId, [Role]=source.[Role]
WHEN NOT MATCHED THEN INSERT (Id, UserName, PasswordHash, ClienteId, [Role]) VALUES(source.Id, source.UserName, source.PasswordHash, source.ClienteId, source.[Role]);

DECLARE @venda uniqueidentifier = 'bbbbbbbb-9999-9999-9999-999999999991';
INSERT INTO Vendas (Id, VendaData, VendaEstado, VendaTotal, ClienteId, Transportadora, CodigoRastreio, UrlRastreio, DataEnvio, NotasInternas)
VALUES (@venda, DATEADD(day,-3,SYSUTCDATETIME()), N'enviada', 44.80, @clienteTeste, N'CTT Expresso', N'CTT123456789PT', N'https://www.ctt.pt/feapl_2/app/open/objectSearch/objectSearch.jspx?objects=CTT123456789PT', DATEADD(day,-1,SYSUTCDATETIME()), N'Encomenda de demonstração.');

INSERT INTO VendaProdutos (Id, VendaId, ProdutoId, Quantidade, PrecoUnitario, DetalhesVariante) VALUES
(NEWID(), @venda, '10000000-0000-0000-0000-000000000002', 1, 24.90, NULL),
(NEWID(), @venda, '10000000-0000-0000-0000-000000000004', 1, 19.90, N'{"Cor das uvas":"Roxo"}');

COMMIT TRANSACTION;

SELECT
  (SELECT COUNT(*) FROM Produtos) AS Produtos,
  (SELECT COUNT(*) FROM FotoProdutos) AS FotosProdutos,
  (SELECT COUNT(*) FROM Categorias) AS Categorias,
  (SELECT COUNT(*) FROM [Users] WHERE [Role] = N'superadmin') AS Superadmins;
