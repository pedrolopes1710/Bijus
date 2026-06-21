import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { AuthCallbackClient } from "./callback-client"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
            <p className="mt-4 text-sm text-muted-foreground">A preparar autenticação...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}
