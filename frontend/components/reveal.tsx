"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Atraso em ms para escalonar vários elementos. */
  delay?: number
  /** Elemento a renderizar (default: div). */
  as?: ElementType
}

/**
 * Envolve conteúdo para surgir (fade + subida) quando entra no viewport.
 * Inspirado nos padrões de scroll-animation do cult-ui / skiper-ui.
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Se já estiver visível (ou sem suporte), mostra logo.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Revela ao entrar no viewport OU se já foi ultrapassado (evita ficar preso invisível).
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      // threshold 0: basta um pixel entrar no viewport. Com um limiar maior, um
      // bloco mais alto do que o ecrã (a grelha de produtos em telemóvel chega a
      // 5700px) nunca chega a atingi-lo e ficaria invisível para sempre.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(node)

    // Rede de segurança: se ao fim de 1,2s nada revelou o bloco (observer que não
    // dispara, animação bloqueada, etc.), mostra à mesma. Mais vale perder a
    // animação do que esconder o conteúdo.
    const fallback = window.setTimeout(() => setVisible(true), 1200)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
