import { Check } from 'lucide-react'
import { Feuille } from '../../components/Feuille'
import { exercice } from '../../data/catalogue'
import type { SeanceEnCours } from '../../data/types'
import { toutesFaites } from '../../logic/seance'

interface ListeExercicesProps {
  seance: SeanceEnCours
  onAller: (index: number) => void
  onTerminer: () => void
  onFermer: () => void
}

export function ListeExercices({ seance, onAller, onTerminer, onFermer }: ListeExercicesProps) {
  return (
    <Feuille titre="Exercices de la séance" onFermer={onFermer}>
      <p className="texte-2 feuille__intro">Machine prise ? Passe à un autre exercice et reviens plus tard.</p>
      {seance.exercices.map((enCours, i) => {
        const fait = toutesFaites(enCours)
        const faites = enCours.series.filter((s) => s.faite).length
        return (
          <button
            key={`${enCours.exerciceId}-${i}`}
            type="button"
            className={`liste-exo${i === seance.index ? ' liste-exo--actif' : ''}`}
            aria-current={i === seance.index ? 'step' : undefined}
            onClick={() => onAller(i)}
          >
            <span className={`liste-exo__numero${fait ? ' liste-exo__numero--fait' : ''}`} aria-hidden="true">
              {fait ? <Check size={16} strokeWidth={3} /> : i + 1}
            </span>
            <span className="liste-exo__nom">{exercice(enCours.exerciceId).nom}</span>
            <span className="liste-exo__statut">
              {faites}/{enCours.series.length}
            </span>
          </button>
        )
      })}
      <button type="button" className="bouton bouton--principal" onClick={onTerminer}>
        Terminer la séance
      </button>
    </Feuille>
  )
}
