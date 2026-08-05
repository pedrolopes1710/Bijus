# MB WAY com Stripe

O checkout usa uma sessão alojada pela Stripe e confirma o pagamento por webhook.

## Configuração

1. Criar ou ativar uma conta Stripe para a empresa.
2. Em **Settings > Payment methods**, ativar **MB WAY**.
3. Copiar a chave secreta de teste para `STRIPE_SECRET_KEY` no `.env`.
4. No Stripe Workbench, criar um webhook com o URL:
   `https://biscuitarte.shop/api/pagamentos/stripe/webhook`
5. Subscrever os eventos:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
6. Copiar o segredo de assinatura do webhook para `STRIPE_WEBHOOK_SECRET`.
7. Reconstruir os serviços com `docker compose up -d --build`.

Para testes locais com Stripe CLI:

```powershell
stripe listen --forward-to http://localhost/api/pagamentos/stripe/webhook
```

Usar inicialmente chaves `sk_test_...`. As chaves `sk_live_...` só devem ser
colocadas depois de o fluxo completo ter sido validado em modo de teste.
