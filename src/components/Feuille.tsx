import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'

interface FeuilleProps {
  titre: string
  onFermer: () => void
  children: ReactNode
}

/** Feuille modale qui monte du bas de l'écran. */
export function Feuille({ titre, onFermer, children }: FeuilleProps) {
  const idTitre = useId()
  const fermer = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const precedent = document.activeElement instanceof HTMLElement ? document.activeElement : null
    fermer.current?.focus({ preventScroll: true })
    return () => precedent?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && onFermer()
    document.addEventListener('keydown', echap)
    return () => document.removeEventListener('keydown', echap)
  }, [onFermer])

  return (
    <div className="feuille__fond" onClick={onFermer}>
      <div
        className="feuille"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitre}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="feuille__poignee" aria-hidden="true" />
        <div className="feuille__entete">
          <h2 id={idTitre} className="feuille__titre">
            {titre}
          </h2>
          <button ref={fermer} type="button" className="bouton-rond" onClick={onFermer} aria-label="Fermer">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
