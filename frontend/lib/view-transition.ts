// Pequeno wrapper à volta da View Transitions API do browser.
// Faz degradê elegante entre páginas (e morph de elemento partilhado)
// quando suportado; caso contrário navega normalmente.

type DocumentWithVT = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> }
}

export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false
  }
  return typeof (document as DocumentWithVT).startViewTransition === "function"
}

export function startViewTransition(update: () => void, onFinish?: () => void): void {
  if (!supportsViewTransitions()) {
    update()
    onFinish?.()
    return
  }

  const transition = (document as DocumentWithVT).startViewTransition!(update)
  if (onFinish) {
    transition.finished.finally(onFinish)
  }
}
