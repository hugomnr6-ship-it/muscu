import { ChevronUp, List, Play, WifiOff, X } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import type { Exercice } from '../../data/types'
import { miniature, urlDemo } from '../../logic/medias'

function abonnerReseau(rappel: () => void): () => void {
  window.addEventListener('online', rappel)
  window.addEventListener('offline', rappel)
  return () => {
    window.removeEventListener('online', rappel)
    window.removeEventListener('offline', rappel)
  }
}

const enLigne = () => navigator.onLine

interface MediaExerciceProps {
  exercice: Exercice
  position: number
  total: number
  lecture: boolean
  onLire: () => void
  onArreter: () => void
  onFermer: () => void
  onListe: () => void
}

/** En-tête : miniature, puis démo courte du mouvement en boucle et sans le son au toucher. */
export function MediaExercice(props: MediaExerciceProps) {
  const { exercice, position, total, lecture, onLire, onArreter, onFermer, onListe } = props
  const connecte = useSyncExternalStore(abonnerReseau, enLigne, () => true)
  const { demo, video } = exercice
  const apercu = video?.youtubeId ?? demo?.youtubeId
  const source = demo
    ? urlDemo(demo)
    : video && `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&rel=0`
  const verticale = lecture && demo?.vertical === true

  return (
    <div className={`media${verticale ? ' media--verticale' : ''}`}>
      {apercu && (
        <img
          className="media__image"
          src={miniature(apercu)}
          alt=""
          width={480}
          height={360}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      {lecture && source && connecte ? (
        <>
          <iframe
            className="media__video"
            src={source}
            title={`Démo : ${exercice.nom}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <button type="button" className="media__masquer" onClick={onArreter}>
            <ChevronUp size={18} aria-hidden="true" /> Masquer
          </button>
        </>
      ) : (
        <>
          <span className="media__voile" aria-hidden="true" />
          {source && connecte && (
            <button
              type="button"
              className="media__play"
              onClick={onLire}
              aria-label={`Voir la démo : ${exercice.nom}`}
            >
              <Play size={26} fill="currentColor" aria-hidden="true" />
            </button>
          )}
          {demo && connecte && (
            <span className="media__duree" aria-hidden="true">
              Démo · {demo.duree} s
            </span>
          )}
          {source && !connecte && (
            <span className="media__hors-ligne">
              <WifiOff size={16} aria-hidden="true" /> Démo dispo avec du réseau
            </span>
          )}
        </>
      )}
      <div className="media__barre">
        <button
          type="button"
          className="bouton-rond media__rond"
          onClick={onFermer}
          aria-label="Quitter la séance (elle reste sauvegardée)"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <span className="media__compteur">
          Exercice {position} / {total}
        </span>
        <button type="button" className="bouton-rond media__rond" onClick={onListe} aria-label="Voir tous les exercices">
          <List size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
