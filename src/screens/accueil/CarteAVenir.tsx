import { ChevronRight } from 'lucide-react'
import { ListeJours } from '../../components/ListeJours'
import { prochainsJours, type RefSeance } from '../../logic/agenda'

const JOURS_AFFICHES = 3

interface CarteAVenirProps {
  aujourdhui: string
  onOuvrirCalendrier: () => void
  onVoirSeance: (seance: RefSeance) => void
}

export function CarteAVenir({ aujourdhui, onOuvrirCalendrier, onVoirSeance }: CarteAVenirProps) {
  const jours = prochainsJours(aujourdhui, JOURS_AFFICHES)
  if (jours.length === 0) return null
  return (
    <section className="carte" aria-labelledby="titre-a-venir">
      <h2 id="titre-a-venir" className="carte__titre">
        À venir
      </h2>
      <ListeJours jours={jours} aujourdhui={aujourdhui} onVoirSeance={onVoirSeance} />
      <button type="button" className="ligne-bouton" onClick={onOuvrirCalendrier}>
        Tout le calendrier
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </section>
  )
}
