/**
 * Luz a percorrer a borda de um contentor (posiciona-se sobre o pai relativo).
 * Inspirado no border-beam do cult-ui, feito só com CSS (ver globals.css).
 */
export function BorderBeam({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`border-beam ${className}`} />
}
