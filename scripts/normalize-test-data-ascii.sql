SET NOCOUNT ON;

UPDATE Categorias SET NomeCategoria = N'Aneis' WHERE Id = '11111111-1111-1111-1111-111111111111';

UPDATE Produtos SET
    NomeProduto = N'Anel Flor de Biscuit',
    DescricaoProduto = N'Anel ajustavel com detalhe floral feito a mao em biscuit.'
WHERE Id = '00000000-0000-0000-0000-000000000001';

UPDATE Produtos SET
    NomeProduto = N'Anel Perola Delicada',
    DescricaoProduto = N'Peca minimalista com acabamento suave e brilho discreto.'
WHERE Id = '00000000-0000-0000-0000-000000000002';

UPDATE Produtos SET
    NomeProduto = N'Colar Coracao Artesanal',
    DescricaoProduto = N'Colar com pendente em biscuit pintado a mao.'
WHERE Id = '00000000-0000-0000-0000-000000000003';

UPDATE Produtos SET
    NomeProduto = N'Colar Dourado Classico'
WHERE Id = '00000000-0000-0000-0000-000000000004';

UPDATE Produtos SET
    DescricaoProduto = N'Brincos com formato gota, ideais para ocasioes especiais.'
WHERE Id = '00000000-0000-0000-0000-000000000006';

UPDATE Produtos SET
    NomeProduto = N'Pulseira Verao Suave'
WHERE Id = '00000000-0000-0000-0000-000000000007';

UPDATE Produtos SET
    DescricaoProduto = N'Porta-chaves em biscuit com flor modelada a mao.'
WHERE Id = '00000000-0000-0000-0000-000000000009';

UPDATE Produtos SET
    NomeProduto = N'Iman Decorativo Casa',
    DescricaoProduto = N'Iman artesanal em biscuit para decoracao ou lembranca.'
WHERE Id = '00000000-0000-0000-0000-000000000010';

UPDATE Produtos SET
    DescricaoProduto = N'Conjunto colorido e leve, pensado para pequenas lembrancas.'
WHERE Id = '00000000-0000-0000-0000-000000000012';

UPDATE Colecoes SET
    DescricaoColecao = N'Pecas leves, coloridas e delicadas para usar todos os dias.'
WHERE Id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT 'Dados normalizados' AS Resultado;
