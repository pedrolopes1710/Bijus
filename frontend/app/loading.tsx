import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <main className="grid min-h-[70svh] place-items-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-foreground text-background shadow-2xl shadow-foreground/10">
          <Sparkles className="h-6 w-6 animate-pulse text-accent" />
        </div>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="page-loading-bar h-full w-1/2 rounded-full bg-accent" />
        </div>
      </div>
    </main>
  )
}
