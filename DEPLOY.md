# Deploy — Biscuit&Arte (produção)

Arquitetura: **Cloudflare (HTTPS) → Cloudflare Tunnel → `caddy:80` → frontend / api**.
Corre numa máquina Windows com Docker Desktop, ligada 24/7. Sem abrir portas no router e sem IP fixo.

---

## 1. Preparar o `.env` de produção
Na máquina de produção, dentro da pasta do projeto:

```bash
cp .env.example .env
```

Preenche o `.env` (o ficheiro tem, em comentário, onde ir buscar cada valor):
- `DOMAIN` — deixa **`:80`**. Atrás do túnel o HTTPS é da Cloudflare; se puseres aqui o domínio, o Caddy tenta HTTPS próprio e redireciona `:80 → :443`, o que dá um ciclo de redirects.
- `PUBLIC_SITE_URL` — `https://biscuitarte.shop`.
- `MSSQL_SA_PASSWORD` — password forte e única. Se a BD já existe, **não a mudes**: só é aplicada quando o volume é criado de raiz.
- `JWT_SECRET` — novo (gera com `openssl rand -hex 64`). Trocá-lo expulsa todas as sessões ativas.
- `SUPER_ADMIN_USERS` — o teu username (para gerires o backoffice).
- `SMTP_*` — `SMTP_PASSWORD` é a password da caixa `info@biscuitarte.shop`. Sem SMTP ninguém consegue confirmar a conta.
- `GOOGLE_CLIENT_ID` — o mesmo de teste (ver passo 5).
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — **live** (ver passo 4).
- `CLOUDFLARE_TUNNEL_TOKEN` — do passo 2.

> Não definas `COMPOSE_PROFILES` em produção (mantém o Stripe CLI de testes desligado).

> `PUBLIC_SITE_URL`, `GOOGLE_CLIENT_ID`, `STRIPE_PUBLISHABLE_KEY` e as `NEXT_PUBLIC_*` são **build args** do frontend: ao mudá-las é obrigatório `up -d --build`, um `restart` não aplica.

---

## 2. Criar o Cloudflare Tunnel
1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com) → **Networks → Tunnels → Create a tunnel** → tipo **Cloudflared**.
2. Dá-lhe um nome (ex.: `bijus`) e **copia o token** (a string longa depois de `--token`). Cola em `CLOUDFLARE_TUNNEL_TOKEN` no `.env`.
3. Em **Public Hostnames**, adiciona:
   | Subdomain | Domain | Service |
   |-----------|--------|---------|
   | *(vazio)* | biscuitarte.shop | `HTTP` → `caddy:80` |
   | www | biscuitarte.shop | `HTTP` → `caddy:80` |
4. Guarda. O DNS (CNAME proxied) é criado **automaticamente** — não mexas nos registos A.

> Mantém os registos de email (MX/SPF/DKIM/DMARC) que já tens — não são afetados.

---

## 3. Arrancar a stack
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Verifica:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker logs bijus-cloudflared-1   # deve dizer "Registered tunnel connection"
```
Abre **https://biscuitarte.shop** — deve carregar com cadeado (HTTPS da Cloudflare).

---

## 4. Stripe em modo live
1. Ativa a conta Stripe (negócio + IBAN).
2. **Programadores → Chaves de API** → copia `sk_live_...` e `pk_live_...` para o `.env`.
3. **Programadores → Webhooks → Add endpoint**:
   - URL: `https://biscuitarte.shop/api/pagamentos/stripe/webhook`
   - Eventos: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
   - Copia o **Signing secret** (`whsec_...`) para `STRIPE_WEBHOOK_SECRET`.
4. Ativa os métodos de pagamento também em live (Cartão, MB WAY, Multibanco…).
5. Reconstrói: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`.

---

## 5. Google Sign-In em produção
1. [Google Cloud Console](https://console.cloud.google.com) → o teu OAuth Client:
   - **Origens JavaScript autorizadas**: adiciona `https://biscuitarte.shop` e `https://www.biscuitarte.shop`.
2. **Ecrã de consentimento OAuth** → **Publicar app** (passar de "Testing" para "Produção").

---

## 6. Windows — manter 24/7
- **Docker Desktop**: Settings → General → ativar **"Start Docker Desktop when you log in"**.
- Ativar **login automático** do Windows (para o Docker Desktop arrancar sem alguém iniciar sessão), ou usar o modo WSL2 sem Desktop.
- **Energia**: Definições → Sistema → Energia → **nunca suspender**; desativar hibernação (`powercfg /h off`).
- Os serviços têm `restart: unless-stopped` — voltam a subir sozinhos quando o Docker arranca.
- O `cloudflared` religa-se automaticamente se a rede cair.

---

## 7. Atualizações e backups
**Atualizar** (após `git pull`):
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Backup da base de dados** (volume `bijus_sqlserver_data`) — exemplo:
```bash
docker exec bijus-db-1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C \
  -Q "BACKUP DATABASE Bijus TO DISK='/var/opt/mssql/backup/Bijus.bak' WITH INIT"
```
E as **imagens dos produtos** ficam no volume `bijus_api_uploads` — inclui ambos os volumes na tua rotina de backup.
