# Deploy self-hosted em servidor 24/7

Este projeto fica pronto para correr num único computador/servidor com Docker:

- `caddy`: reverse proxy público, HTTP/HTTPS e domínio
- `frontend`: Next.js
- `api`: ASP.NET Core
- `db`: SQL Server

## 1. Requisitos do servidor

Recomendado:

- Ubuntu Server 22.04/24.04 LTS
- 2 vCPU
- 4 GB RAM mínimo, 8 GB ideal por causa do SQL Server
- 40 GB SSD ou mais
- Docker e Docker Compose instalados
- portas `80` e `443` abertas no router/firewall

Se for um PC em casa, também precisas de:

- IP público ou DNS dinâmico
- port forwarding do router para o servidor nas portas `80` e `443`
- idealmente UPS e backups externos

## 2. Configurar domínio

No fornecedor do domínio, cria:

```txt
A     @      IP_DO_SERVIDOR
CNAME www    dominio.pt
```

Depois usa `https://dominio.pt` como `PUBLIC_SITE_URL`.

## 3. Criar ficheiro `.env`

Na raiz do projeto:

```bash
cp .env.example .env
```

Edita:

```env
DOMAIN=dominio.pt
PUBLIC_SITE_URL=https://dominio.pt
ACME_EMAIL=o-teu-email@dominio.pt

MSSQL_DATABASE=Bijus
MSSQL_SA_PASSWORD=uma_password_muito_forte
JWT_SECRET=uma_chave_muito_longa_e_aleatoria
```

Gera uma chave JWT:

```bash
openssl rand -hex 64
```

## 4. Arrancar produção

```bash
docker compose up -d --build
```

Ver logs:

```bash
docker compose logs -f
```

Ver estado:

```bash
docker compose ps
```

## 5. Atualizar o site

```bash
git pull
docker compose up -d --build
```

## 6. Backups da base de dados

Cria backups regulares do volume `sqlserver_data`. Para produção real, mantém cópias fora do servidor.

Exemplo simples:

```bash
mkdir -p backups
docker compose exec db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "BACKUP DATABASE [Bijus] TO DISK = N'/var/opt/mssql/backup/bijus.bak' WITH INIT"
```

Também podes fazer snapshot do volume/VM se estiveres num VPS.

## 7. Auth0 / Google / Facebook

No Auth0, configura o callback:

```txt
https://dominio.pt/auth/callback
```

E preenche no `.env`:

```env
NEXT_PUBLIC_AUTH0_DOMAIN=...
NEXT_PUBLIC_AUTH0_CLIENT_ID=...
NEXT_PUBLIC_AUTH0_AUDIENCE=
NEXT_PUBLIC_AUTH0_REDIRECT_URI=https://dominio.pt/auth/callback
NEXT_PUBLIC_AUTH0_GOOGLE_CONNECTION=google-oauth2
NEXT_PUBLIC_AUTH0_FACEBOOK_CONNECTION=facebook
```

Depois recompila:

```bash
docker compose up -d --build frontend
```

## 8. Segurança mínima

- Nunca commits o ficheiro `.env`
- Roda passwords antigas que tenham estado no repositório
- Mantém Docker e sistema operativo atualizados
- Faz backups automáticos
- Testa restore dos backups antes de confiar neles
