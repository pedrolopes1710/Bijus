SET NOCOUNT ON;

DECLARE @catAneis uniqueidentifier = '11111111-1111-1111-1111-111111111111';
DECLARE @catColares uniqueidentifier = '22222222-2222-2222-2222-222222222222';
DECLARE @catBrincos uniqueidentifier = '33333333-3333-3333-3333-333333333333';
DECLARE @catPulseiras uniqueidentifier = '44444444-4444-4444-4444-444444444444';
DECLARE @catBiscuit uniqueidentifier = '55555555-5555-5555-5555-555555555555';
DECLARE @catBeleza uniqueidentifier = '66666666-6666-6666-6666-666666666666';
DECLARE @catInfantil uniqueidentifier = '77777777-7777-7777-7777-777777777777';
DECLARE @catCasa uniqueidentifier = '88888888-8888-8888-8888-888888888888';

DECLARE @colAtelierRosa uniqueidentifier = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DECLARE @colBrilhoDelicado uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DECLARE @colOfertas uniqueidentifier = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
DECLARE @colCasaDoce uniqueidentifier = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
DECLARE @colRitualSuave uniqueidentifier = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

DECLARE @categorias TABLE (
    Id uniqueidentifier PRIMARY KEY,
    Nome nvarchar(max)
);

INSERT INTO @categorias (Id, Nome) VALUES
(@catAneis, N'Anéis'),
(@catColares, N'Colares'),
(@catBrincos, N'Brincos'),
(@catPulseiras, N'Pulseiras'),
(@catBiscuit, N'Biscuit Artesanal'),
(@catBeleza, N'Beleza & Cuidado'),
(@catInfantil, N'Infantil'),
(@catCasa, N'Casa & Decoração');

MERGE Categorias AS target
USING @categorias AS source
ON target.Id = source.Id
WHEN MATCHED THEN
    UPDATE SET NomeCategoria = source.Nome
WHEN NOT MATCHED THEN
    INSERT (Id, NomeCategoria)
    VALUES (source.Id, source.Nome);

DECLARE @colecoes TABLE (
    Id uniqueidentifier PRIMARY KEY,
    Nome nvarchar(max),
    Descricao nvarchar(max),
    CriadaEm datetime2,
    Estado int
);

INSERT INTO @colecoes (Id, Nome, Descricao, CriadaEm, Estado) VALUES
(@colAtelierRosa, N'Atelier Rosa', N'Peças artesanais com tons suaves, detalhes florais e acabamento feito à mão.', DATEADD(day, -4, SYSUTCDATETIME()), 0),
(@colBrilhoDelicado, N'Brilho Delicado', N'Acessórios femininos com luz subtil para looks românticos, elegantes e fáceis de usar.', DATEADD(day, -14, SYSUTCDATETIME()), 0),
(@colOfertas, N'Momentos de Oferta', N'Lembranças pequenas, bonitas e prontas para surpreender em aniversários, batizados e datas especiais.', DATEADD(day, -25, SYSUTCDATETIME()), 0),
(@colCasaDoce, N'Casa Doce', N'Decoração artesanal com presença leve para cantinhos acolhedores e mesas especiais.', DATEADD(day, -36, SYSUTCDATETIME()), 0),
(@colRitualSuave, N'Ritual Suave', N'Produtos de cuidado e beleza pensados para uma rotina delicada e visualmente cuidada.', DATEADD(day, -48, SYSUTCDATETIME()), 0);

MERGE Colecoes AS target
USING @colecoes AS source
ON target.Id = source.Id
WHEN MATCHED THEN
    UPDATE SET
        NomeColecao = source.Nome,
        DescricaoColecao = source.Descricao,
        DataAtualizacaoColecao = SYSUTCDATETIME(),
        EstadoColecao = source.Estado
WHEN NOT MATCHED THEN
    INSERT (Id, NomeColecao, DescricaoColecao, DataAtualizacaoColecao, DataCriacaoColecao, EstadoColecao)
    VALUES (source.Id, source.Nome, source.Descricao, SYSUTCDATETIME(), source.CriadaEm, source.Estado);

DECLARE @fotosColecoes TABLE (
    ColecaoId uniqueidentifier,
    Url nvarchar(max)
);

INSERT INTO @fotosColecoes (ColecaoId, Url) VALUES
(@colAtelierRosa, N'/uploads/colecoes/17bfdea0-9118-41bf-8d32-d84c0c3a8dd7.jpg'),
(@colAtelierRosa, N'/uploads/colecoes/367ee303-b091-4383-9717-c1eeb0cdb7e9.jpg'),
(@colBrilhoDelicado, N'/uploads/colecoes/3dba179e-4148-4dd7-a8a9-b9077fbbcc0d.jpg'),
(@colBrilhoDelicado, N'/uploads/colecoes/521f0b1b-03dd-4a30-a46b-046d3e52c825.jpg'),
(@colOfertas, N'/uploads/colecoes/8f1b1c7e-4606-410b-8131-11488bdc22b6.jpg'),
(@colCasaDoce, N'/uploads/colecoes/c328f056-8a6f-446c-8967-476ed4887e56.jpg'),
(@colRitualSuave, N'/uploads/colecoes/bd2c0805-eac1-4f33-93b0-b905dc325d6c.jpg');

INSERT INTO FotoColecoes (Id, UrlColecao, ColecaoId)
SELECT NEWID(), f.Url, f.ColecaoId
FROM @fotosColecoes f
WHERE NOT EXISTS (
    SELECT 1
    FROM FotoColecoes existing
    WHERE existing.ColecaoId = f.ColecaoId
      AND existing.UrlColecao = f.Url
);

DECLARE @produtos TABLE (
    Id uniqueidentifier PRIMARY KEY,
    Nome nvarchar(max),
    Descricao nvarchar(max),
    Preco float,
    Stock int,
    CategoriaId uniqueidentifier,
    ColecaoId uniqueidentifier,
    Foto nvarchar(max)
);

INSERT INTO @produtos (Id, Nome, Descricao, Preco, Stock, CategoriaId, ColecaoId, Foto) VALUES
('00000000-0000-0000-0000-000000000001', N'Anel Flor Rosé', N'Anel ajustável com flor modelada à mão e acabamento rosé delicado.', 12.90, 8, @catAneis, @colBrilhoDelicado, N'/uploads/produtos/2733f3aa-e31b-49f4-8444-17a51880f676.jpg'),
('00000000-0000-0000-0000-000000000002', N'Anel Pérola Serena', N'Peça minimalista com pérola suave, brilho discreto e toque feminino.', 14.50, 15, @catAneis, @colBrilhoDelicado, N'/uploads/produtos/43a5c739-c919-4161-bce8-d7652f04e7f0.jpg'),
('00000000-0000-0000-0000-000000000003', N'Colar Coração de Atelier', N'Colar com pendente artesanal pintado à mão para presentes românticos.', 18.90, 6, @catColares, @colAtelierRosa, N'/uploads/produtos/4fd38bb5-da9a-48e6-a86a-b8f59b4e470f.jpeg'),
('00000000-0000-0000-0000-000000000004', N'Colar Dourado Aurora', N'Colar elegante para combinar com vestidos leves, camisas e looks especiais.', 22.00, 12, @catColares, @colBrilhoDelicado, N'/uploads/produtos/5bedb1cc-aea0-4c27-9d17-97e6de172260.jpg'),
('00000000-0000-0000-0000-000000000005', N'Brincos Margarida Rosa', N'Brincos leves com flor em biscuit, pensados para um visual doce e luminoso.', 9.90, 20, @catBrincos, @colAtelierRosa, N'/uploads/produtos/70eda05a-b11b-4a9b-af67-6d84c82d3171.jpg'),
('00000000-0000-0000-0000-000000000006', N'Brincos Gota Champagne', N'Brincos com formato gota e acabamento polido para ocasiões especiais.', 16.90, 10, @catBrincos, @colBrilhoDelicado, N'/uploads/produtos/73ae3ecd-c9fd-457d-8243-a8c245185d84.jpeg'),
('00000000-0000-0000-0000-000000000007', N'Pulseira Jardim Suave', N'Pulseira colorida com apontamentos artesanais e paleta feminina.', 13.90, 18, @catPulseiras, @colAtelierRosa, N'/uploads/produtos/7566d169-f805-4d34-92f2-97cf5d422259.jpg'),
('00000000-0000-0000-0000-000000000008', N'Pulseira Fio de Luz', N'Pulseira discreta com acabamento dourado, ideal para usar em camadas.', 15.90, 9, @catPulseiras, @colBrilhoDelicado, N'/uploads/produtos/817e3d0d-0a06-4c17-aba4-28642e7182c9.jpg'),
('00000000-0000-0000-0000-000000000009', N'Porta-chaves Mini Flor', N'Porta-chaves em biscuit com flor modelada à mão para lembranças delicadas.', 7.50, 25, @catBiscuit, @colOfertas, N'/uploads/produtos/9e6003a0-335c-4055-bc79-e9a1355bb8f5.jpg'),
('00000000-0000-0000-0000-000000000010', N'Íman Casa Florida', N'Íman artesanal em biscuit para decoração, convites ou lembranças especiais.', 6.90, 30, @catCasa, @colCasaDoce, N'/uploads/produtos/a990430f-662e-4720-b2c9-4364bbb9747d.jpeg'),
('00000000-0000-0000-0000-000000000011', N'Conjunto Brilho Natural', N'Conjunto coordenado de colar e brincos com acabamento elegante para oferta.', 29.90, 5, @catColares, @colBrilhoDelicado, N'/uploads/produtos/b804a353-49ba-431e-8263-927432215a9e.jpg'),
('00000000-0000-0000-0000-000000000012', N'Conjunto Infantil Jardim', N'Conjunto colorido e leve para pequenas lembranças com ar artesanal.', 11.90, 14, @catInfantil, @colOfertas, N'/uploads/produtos/ce1ff1aa-d82f-4d32-a5d6-9b55d93fcbf0.jpg'),
('00000000-0000-0000-0000-000000000013', N'Sabonete Bouquet Suave', N'Sabonete decorativo com perfume leve e apresentação pronta para oferta.', 8.90, 22, @catBeleza, @colRitualSuave, N'/uploads/produtos/dbeaf574-2b13-4a61-a44d-a64e189e2303.jpg'),
('00000000-0000-0000-0000-000000000014', N'Vela Jardim de Chá', N'Vela artesanal para criar ambiente acolhedor em mesas, quartos e presentes.', 17.90, 11, @catCasa, @colCasaDoce, N'/uploads/produtos/facb8168-a45f-4474-9904-1128fa11cd86.jpg'),
('00000000-0000-0000-0000-000000000015', N'Lembrança Batizado Floral', N'Pequena peça personalizada em biscuit para batizados, festas e mesas doces.', 10.50, 16, @catInfantil, @colOfertas, N'/uploads/produtos/ce1ff1aa-d82f-4d32-a5d6-9b55d93fcbf0.jpg'),
('00000000-0000-0000-0000-000000000016', N'Caixa Aromática Rosé', N'Caixa artesanal com detalhe floral e acabamento delicado para presentes.', 19.90, 7, @catBiscuit, @colAtelierRosa, N'/uploads/produtos/b804a353-49ba-431e-8263-927432215a9e.jpg');

MERGE Produtos AS target
USING @produtos AS source
ON target.Id = source.Id
WHEN MATCHED THEN
    UPDATE SET
        NomeProduto = source.Nome,
        DescricaoProduto = source.Descricao,
        PrecoProduto = source.Preco,
        StockProduto = source.Stock,
        CategoriaId = source.CategoriaId,
        ColecaoId = source.ColecaoId
WHEN NOT MATCHED THEN
    INSERT (Id, NomeProduto, DescricaoProduto, PrecoProduto, StockProduto, CategoriaId, ColecaoId)
    VALUES (source.Id, source.Nome, source.Descricao, source.Preco, source.Stock, source.CategoriaId, source.ColecaoId);

INSERT INTO FotoProdutos (Id, UrlProduto, ProdutoId)
SELECT NEWID(), p.Foto, p.Id
FROM @produtos p
WHERE NOT EXISTS (
    SELECT 1
    FROM FotoProdutos existing
    WHERE existing.ProdutoId = p.Id
      AND existing.UrlProduto = p.Foto
);

IF NOT EXISTS (SELECT 1 FROM Clientes WHERE EmailCliente = N'teste@bijus.local')
BEGIN
    DECLARE @clienteId uniqueidentifier = '99999999-9999-9999-9999-999999999999';
    INSERT INTO Clientes (Id, NomeCliente, EmailCliente, MoradaCliente)
    VALUES (@clienteId, N'Cliente Teste', N'teste@bijus.local', N'Rua das Flores, 123, 1000-001 Lisboa');
END
ELSE
BEGIN
    UPDATE Clientes
    SET NomeCliente = N'Cliente Teste',
        MoradaCliente = N'Rua das Flores, 123, 1000-001 Lisboa'
    WHERE EmailCliente = N'teste@bijus.local';
END;

DECLARE @userTesteId uniqueidentifier = 'aaaaaaaa-9999-9999-9999-999999999999';
DECLARE @clienteTesteId uniqueidentifier = '99999999-9999-9999-9999-999999999999';
DECLARE @passwordTesteHash nvarchar(max) = N'$2a$11$rDEPbhwkf3iP4UT/TAadZOiQ.iXP9/nrrA5bikviTFZceXoNtdRaO';

MERGE [Users] AS target
USING (
    SELECT
        @userTesteId AS Id,
        N'teste' AS UserName,
        @passwordTesteHash AS PasswordHash,
        @clienteTesteId AS ClienteId
) AS source
ON target.Id = source.Id
WHEN MATCHED THEN
    UPDATE SET
        UserName = source.UserName,
        PasswordHash = source.PasswordHash,
        ClienteId = source.ClienteId
WHEN NOT MATCHED THEN
    INSERT (Id, UserName, PasswordHash, ClienteId)
    VALUES (source.Id, source.UserName, source.PasswordHash, source.ClienteId);

SELECT
    (SELECT COUNT(*) FROM Categorias) AS Categorias,
    (SELECT COUNT(*) FROM Colecoes) AS Colecoes,
    (SELECT COUNT(*) FROM Produtos) AS Produtos,
    (SELECT COUNT(*) FROM FotoProdutos) AS FotosProdutos,
    (SELECT COUNT(*) FROM FotoColecoes) AS FotosColecoes,
    (SELECT COUNT(*) FROM [Users]) AS Users;
