# Produção com Cloudflare Pages + Cloudflare Tunnel

Modelo recomendado:

```txt
Cloudflare Pages
  -> Frontend Next.js público

Cloudflare Tunnel
  -> api.teudominio.pt
  -> API .NET no teu servidor
  -> SQL Server local no teu servidor
```

Neste modelo, não precisas abrir portas no router para a API. O `cloudflared` cria um túnel seguro entre o teu servidor e a Cloudflare.

## 1. Domínio na Cloudflare

1. Cria conta em Cloudflare
2. Adiciona o domínio
3. Muda os nameservers no fornecedor do domínio para os nameservers da Cloudflare

Usaremos:

```txt
www.teudominio.pt  -> frontend
api.teudominio.pt  -> backend
```

## 2. Frontend na Cloudflare Pages

Na Cloudflare:

1. Workers & Pages
2. Create application
3. Pages
4. Connect to Git
5. Seleciona o repositório

Configuração:

```txt
Root directory: frontend
Build command: npm run build
Build output directory: .next
```

Variáveis de ambiente no Pages:

```env
NEXT_PUBLIC_API_URL=https://api.teudominio.pt/api
NEXT_PUBLIC_AUTH0_DOMAIN=
NEXT_PUBLIC_AUTH0_CLIENT_ID=
NEXT_PUBLIC_AUTH0_AUDIENCE=
NEXT_PUBLIC_AUTH0_REDIRECT_URI=https://www.teudominio.pt/auth/callback
NEXT_PUBLIC_AUTH0_GOOGLE_CONNECTION=google-oauth2
NEXT_PUBLIC_AUTH0_FACEBOOK_CONNECTION=facebook
```

Nota: se Cloudflare Pages pedir suporte Next.js, usa a integração/framework preset de Next.js.

## 3. API + base de dados no teu servidor

No servidor:

```bash
git clone URL_DO_TEU_REPO
cd Bijus
cp .env.cloudflare.example .env
nano .env
```

Configura:

```env
FRONTEND_PUBLIC_URL=https://www.teudominio.pt
API_PUBLIC_URL=https://api.teudominio.pt
MSSQL_DATABASE=Bijus
MSSQL_SA_PASSWORD=uma_password_muito_forte
JWT_SECRET=resultado_do_openssl
CLOUDFLARE_TUNNEL_TOKEN=token_do_tunnel
```

Gera `JWT_SECRET`:

```bash
openssl rand -hex 64
```

## 4. Criar Cloudflare Tunnel

Na Cloudflare:

1. Zero Trust
2. Networks
3. Tunnels
4. Create a tunnel
5. Tipo: Cloudflared
6. Copia o token

No Public Hostname:

```txt
Subdomain: api
Domain: teudominio.pt
Service: http://api:8080
```

Se estiveres a usar o token no Docker Compose, cola-o em:

```env
CLOUDFLARE_TUNNEL_TOKEN=...
```

## 5. Arrancar API, BD e tunnel

```bash
docker compose -f docker-compose.cloudflare.yml up -d --build
```

Ver estado:

```bash
docker compose -f docker-compose.cloudflare.yml ps
```

Ver logs:

```bash
docker compose -f docker-compose.cloudflare.yml logs -f
```

Testar API:

```txt
https://api.teudominio.pt/api/produtos
```

## 6. Ambiente de teste antes da produção

Para testar antes de apontar domínio:

1. Corre o ambiente local com [LOCAL_TESTING.md](LOCAL_TESTING.md)
2. Confirma que API e base de dados funcionam
3. Só depois liga Cloudflare Tunnel
4. Por fim, publica o frontend em Pages

## 7. Segurança

- Nunca publiques `.env`
- Não abras SQL Server para a internet
- A API deve ficar exposta só pelo Cloudflare Tunnel
- Mantém backups da pasta/volume da base de dados
- Usa passwords longas e únicas
