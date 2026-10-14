import { geometrieCourbe } from '../logic/progression'

interface CourbeProps {
  valeurs: readonly number[]
  libelles: readonly string[]
  description: string
}

/** Courbe de progression de la maquette : ligne bleue, aire à 10 %, dernier point marqué. */
export function Courbe({ valeurs, libelles, description }: CourbeProps) {
  const geometrie = geometrieCourbe(valeurs)
  if (!geometrie) return null
  return (
    <figure className="courbe" aria-label={description}>
      <div className="courbe__zone">
        <span className="courbe__grille courbe__grille--haut" />
        <span className="courbe__grille courbe__grille--milieu" />
        <span className="courbe__grille courbe__grille--bas" />
        <svg viewBox="0 0 320 130" preserveAspectRatio="none" className="courbe__svg" aria-hidden="true">
          <path d={geometrie.aire} className="courbe__aire" />
          <polyline points={geometrie.ligne} className="courbe__ligne" />
        </svg>
        <span
          className="courbe__point"
          style={{ left: `${geometrie.dernier.l}%`, top: `${geometrie.dernier.t}%` }}
          aria-hidden="true"
        />
      </div>
      <figcaption className="courbe__axe">
        {libelles.map((libelle, i) => (
          <span key={i}>{libelle}</span>
        ))}
      </figcaption>
    </figure>
  )
}
