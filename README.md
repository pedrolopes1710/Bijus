# Biscuit&Arte

Aplicação web de e-commerce para catálogo, coleções, carrinho, checkout e área de cliente.

## Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: ASP.NET Core, Entity Framework Core, SQL Server
- Autenticação local: JWT
- Login social: Auth0 com ligações Google/Facebook

## Configuração do frontend

Crie um ficheiro `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5225/api

# Opcional, necessário para Google/Facebook login
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.eu.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_AUTH0_AUDIENCE=
NEXT_PUBLIC_AUTH0_GOOGLE_CONNECTION=google-oauth2
NEXT_PUBLIC_AUTH0_FACEBOOK_CONNECTION=facebook
```

No Auth0:

1. Crie uma Application do tipo **Single Page Application**.
2. Em **Allowed Callback URLs**, adicione:

```txt
http://localhost:3000/auth/callback
```

3. Em **Allowed Web Origins**, adicione:

```txt
http://localhost:3000
```

4. Em **Authentication > Social**, ative Google e Facebook para a Application.
5. Use as connection names standard `google-oauth2` e `facebook`, ou ajuste `NEXT_PUBLIC_AUTH0_GOOGLE_CONNECTION` / `NEXT_PUBLIC_AUTH0_FACEBOOK_CONNECTION`.

## Comandos úteis

```bash
cd frontend
npm install
npm run dev
npm run build
```

```bash
dotnet run --project dddnetcore
```

## Produção self-hosted

O projeto inclui `docker-compose.yml`, `Caddyfile` e Dockerfiles para correr tudo num único servidor:

- SQL Server
- API ASP.NET Core
- Frontend Next.js
- Caddy com HTTPS automático

Segue o guia em [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Para testar primeiro num computador local/servidor de casa, segue [docs/LOCAL_TESTING.md](docs/LOCAL_TESTING.md).

Produção recomendada para este projeto:

- Frontend em Cloudflare Pages
- API + SQL Server no teu servidor
- Cloudflare Tunnel para expor `api.teudominio.pt`

Segue [docs/CLOUDFLARE_PRODUCTION.md](docs/CLOUDFLARE_PRODUCTION.md).

## Notas de segurança

Não guarde passwords, client secrets, connection strings reais ou chaves JWT no repositório. Use variáveis de ambiente ou secrets do ambiente de deploy.

Se alguma password real já esteve no repositório, troca-a antes de colocar o projeto online.
