# Checklist para deixar o site pronto

## Loja

- [ ] Confirmar identidade: nome final, logo, cores e tom de comunicação
- [ ] Rever textos em português europeu/português do Brasil e escolher um padrão
- [ ] Garantir imagens reais para produtos, coleções e categorias
- [ ] Remover todos os produtos/categorias de teste
- [ ] Validar stock e preço em todos os produtos
- [ ] Melhorar página de produto com materiais, dimensões e cuidados

## Funcionalidade

- [ ] Checkout criar venda real no backend
- [ ] Enviar email de confirmação
- [ ] Área de cliente mostrar encomendas reais
- [ ] Favoritos ligados a conta, não apenas `localStorage`
- [ ] Pesquisa com filtros por categoria/preço/stock
- [ ] Estados vazios e erros bem desenhados

## Administração

- [ ] Criar painel admin ou processo simples para gerir produtos
- [ ] Upload de imagens seguro
- [ ] Proteção de endpoints administrativos
- [ ] Backups automáticos da base de dados e uploads

## Pagamentos

- [ ] Escolher método: MB WAY, transferência, Stripe, PayPal ou outro
- [ ] Integrar pagamento real
- [ ] Guardar estado da encomenda: pendente, paga, enviada, entregue, cancelada

## Produção

- [ ] Domínio na Cloudflare
- [ ] Frontend publicado em Cloudflare Pages
- [ ] API exposta por Cloudflare Tunnel
- [ ] SQL Server privado no servidor
- [ ] `.env` forte e fora do Git
- [ ] Backups testados
- [ ] Monitorização básica dos containers

## Legal/confiança

- [ ] Política de privacidade
- [ ] Termos e condições
- [ ] Política de trocas/devoluções
- [ ] Contactos visíveis
- [ ] NIF/identificação comercial se aplicável
- [ ] Banner/gestão de cookies se necessário
