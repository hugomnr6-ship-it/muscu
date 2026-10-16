import { ChevronRight } from 'lucide-react'
import { useId, useState } from 'react'
import type { Exercice } from '../../data/types'

interface TechniqueProps {
  exercice: Exercice
  /** Dépliée la première fois, pour lire les réglages avant de commencer. */
  ouverteAuDepart: boolean
}

export function Technique({ exercice, ouverteAuDepart }: TechniqueProps) {
  const [ouverte, setOuverte] = useState(ouverteAuDepart)
  const idContenu = useId()
  const lienYoutube = exercice.video
    ? `https://www.youtube.com/watch?v=${exercice.video.youtubeId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(exercice.rechercheVideo)}`

  return (
    <div className={`technique${ouverte ? ' technique--ouverte' : ''}`}>
      <button
        type="button"
        className="technique__bouton"
        aria-expanded={ouverte}
        aria-controls={idContenu}
        onClick={() => setOuverte((o) => !o)}
      >
        Points clés de la technique
        <ChevronRight className="technique__chevron" size={24} aria-hidden="true" />
      </button>
      {ouverte && (
        <div id={idContenu}>
          <ol className="technique__liste">
            {exercice.technique.map((point, i) => (
              <li key={i}>
                <span className="technique__numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
          <p className="technique__source">
            Besoin de plus d’explications ?{' '}
            <a href={lienYoutube} target="_blank" rel="noopener noreferrer">
              Voir le tuto complet sur YouTube
            </a>
            {exercice.video ? ` (${exercice.video.chaine})` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
