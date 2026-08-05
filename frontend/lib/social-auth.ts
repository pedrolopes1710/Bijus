import type { Usuario } from "./types"

export type SocialProvider = "google" | "facebook"

interface AuthTransaction {
  codeVerifier: string
  provider: SocialProvider
  returnTo?: string
  redirectUri: string
  state: string
}

interface Auth0Config {
  audience?: string
  clientId: string
  domain: string
  redirectUri: string
}

interface Auth0UserInfo {
  email?: string
  name?: string
  nickname?: string
  picture?: string
  sub: string
}

const AUTH_TRANSACTION_KEY = "bijus_social_auth_transaction"

const providerConnection: Record<SocialProvider, string> = {
  google: process.env.NEXT_PUBLIC_AUTH0_GOOGLE_CONNECTION || "google-oauth2",
  facebook: process.env.NEXT_PUBLIC_AUTH0_FACEBOOK_CONNECTION || "facebook",
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array) {
  const byteArray = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const binary = Array.from(byteArray, (byte) => String.fromCharCode(byte)).join("")

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function randomString() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value)
  return crypto.subtle.digest("SHA-256", data)
}

function getConfig(): Auth0Config | null {
  if (typeof window === "undefined") return null

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID

  if (!domain || !clientId) return null

  return {
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    clientId,
    domain,
    redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || `${window.location.origin}/auth/callback`,
  }
}

export function isSocialLoginConfigured() {
  return Boolean(getConfig())
}

export async function beginSocialLogin(provider: SocialProvider, returnTo?: string) {
  const config = getConfig()

  if (!config) {
    throw new Error("O login social ainda não está configurado. Defina NEXT_PUBLIC_AUTH0_DOMAIN e NEXT_PUBLIC_AUTH0_CLIENT_ID.")
  }

  const state = randomString()
  const codeVerifier = randomString()
  const codeChallenge = base64UrlEncode(await sha256(codeVerifier))

  const transaction: AuthTransaction = {
    codeVerifier,
    provider,
    returnTo: returnTo?.startsWith("/") && !returnTo.startsWith("//") && !returnTo.startsWith("/login") ? returnTo : undefined,
    redirectUri: config.redirectUri,
    state,
  }

  sessionStorage.setItem(AUTH_TRANSACTION_KEY, JSON.stringify(transaction))

  const params = new URLSearchParams({
    client_id: config.clientId,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    connection: providerConnection[provider],
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
  })

  if (config.audience) {
    params.set("audience", config.audience)
  }

  window.location.assign(`https://${config.domain}/authorize?${params.toString()}`)
}

export async function completeSocialLogin(code: string, state: string) {
  const config = getConfig()
  const transactionRaw = sessionStorage.getItem(AUTH_TRANSACTION_KEY)

  if (!config || !transactionRaw) {
    throw new Error("Sessão de login social expirada. Tente novamente.")
  }

  const transaction = JSON.parse(transactionRaw) as AuthTransaction

  if (transaction.state !== state) {
    throw new Error("Não foi possível validar o pedido de autenticação.")
  }

  const tokenResponse = await fetch(`https://${config.domain}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: config.clientId,
      code,
      code_verifier: transaction.codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: transaction.redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error("Não foi possível concluir o login social.")
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token || tokenData.id_token

  if (!accessToken) {
    throw new Error("O fornecedor de autenticação não devolveu um token válido.")
  }

  const userResponse = await fetch(`https://${config.domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userResponse.ok) {
    throw new Error("Não foi possível obter os dados do utilizador.")
  }

  const userInfo = (await userResponse.json()) as Auth0UserInfo
  const name = userInfo.name || userInfo.nickname || userInfo.email || "Utilizador"
  const email = userInfo.email || ""

  const usuario: Usuario = {
    id: userInfo.sub,
    role: "cliente",
    userName: name,
    clienteDto: {
      id: userInfo.sub,
      nome: name,
      email,
      morada: "",
    },
  }

  sessionStorage.removeItem(AUTH_TRANSACTION_KEY)

  return {
    provider: transaction.provider,
    returnTo: transaction.returnTo,
    token: accessToken,
    usuario,
  }
}
