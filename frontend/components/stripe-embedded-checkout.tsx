"use client"

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe, type Stripe } from "@stripe/stripe-js"

// Carrega o Stripe.js uma única vez (a chave publicável não é secreta).
let stripePromise: Promise<Stripe | null> | null = null
function getStripe() {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!pk) return null
  if (!stripePromise) stripePromise = loadStripe(pk)
  return stripePromise
}

export function StripeEmbeddedCheckout({ clientSecret }: { clientSecret: string }) {
  const stripe = getStripe()

  if (!stripe) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Pagamento indisponível: falta configurar a chave publicável da Stripe
        (<code>STRIPE_PUBLISHABLE_KEY</code> no .env).
      </div>
    )
  }

  return (
    <div className="min-h-[420px]">
      <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
