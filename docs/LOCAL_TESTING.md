# Ambiente de teste num computador local

Este guia é para correr o site todo num computador/servidor dentro da tua rede, sem domínio público.

## 1. Instalar sistema operativo

Recomendado:

- Ubuntu Server 24.04 LTS
- ligação por cabo Ethernet
- IP fixo na rede local, por exemplo `192.168.1.50`

Também podes usar Windows com Docker Desktop, mas Ubuntu Server é mais parecido com produção.

## 2. Instalar dependências no servidor

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl git openssl
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker
```

Confirma:

```bash
docker --version
docker compose version
```

## 3. Obter o projeto

```bash
git clone URL_DO_TEU_REPO
cd Bijus
```

Se ainda não estiver no GitHub, copia a pasta do projeto para o servidor.

## 4. Criar configuração local

```bash
cp .env.test.example .env
nano .env
```

Muda:

```env
PUBLIC_SITE_URL=http://192.168.1.50
MSSQL_SA_PASSWORD=uma_password_muito_forte
JWT_SECRET=resultado_do_openssl
```

Gera a chave JWT:

```bash
openssl rand -hex 64
```

Mantém:

```env
DOMAIN=:80
```

Assim o Caddy serve por HTTP na porta `80`, sem precisar de domínio nem certificado.

## 5. Arrancar tudo

```bash
docker compose up -d --build
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f
```

## 6. Aceder ao site

No teu PC ou telemóvel, abre:

```txt
http://192.168.1.50
```

Troca `192.168.1.50` pelo IP local real do servidor.

## 7. Comandos úteis

Parar:

```bash
docker compose down
```

Rebuild depois de alterações:

```bash
docker compose up -d --build
```

Ver logs só da API:

```bash
docker compose logs -f api
```

Ver logs da base de dados:

```bash
docker compose logs -f db
```

## 8. Quando passar para produção

Quando estiver pronto:

1. Compra/configura domínio
2. Muda `.env` para:

```env
DOMAIN=teudominio.pt
PUBLIC_SITE_URL=https://teudominio.pt
```

3. Aponta DNS para o IP público do servidor/VPS
4. Corre:

```bash
docker compose up -d --build
```
