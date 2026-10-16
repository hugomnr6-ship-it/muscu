import { Play } from 'lucide-react'
import { Feuille } from '../../components/Feuille'
import { EXERCICES } from '../../data/catalogue'
import { SEANCES } from '../../data/programme'
import type { SeanceFaite } from '../../data/types'
import type { RefSeance } from '../../logic/agenda'
import { apercuSeance } from '../../logic/apercu'
import { pluriel } from '../../logic/libelles'
import { ApercuExercice } from './ApercuExercice'
import './apercu.css'

const BONS_REFLEXES = [
  'Machine prise ? Demande « Il te reste combien de séries ? », ou fais un autre exo et reviens. Tout le monde fait ça.',
  'Tu ne trouves pas une machine ? Cherche le nom écrit dessus (il est dans chaque exo) ou demande à un coach de la salle : c’est son travail.',
  'Sur les machines, un autocollant montre le mouvement et les réglages.',
  'L’ordre des exos n’est pas grave : garde juste les bras et les abdos pour la fin.',
  'Moins de monde, moins de stress : en général, évite 17h30-20h30.',
]

interface ApercuSeanceProps {
  choix: RefSeance
  historique: readonly SeanceFaite[]
  /** Absent quand une séance est déjà en cours : on ne propose pas d'en commencer une autre. */
  onCommencer?: () => void
  onFermer: () => void
}

/** Aperçu d'une séance avant de la commencer : exercices, séries, reps, démos et technique. */
export function ApercuSeance({ choix, historique, onCommencer, onFermer }: ApercuSeanceProps) {
  const seance = SEANCES[choix.seanceId]
  const exercices = apercuSeance(seance, historique, choix)
  const series = exercices.reduce((total, e) => total + e.series, 0)
  const titre = choix.decouverte ? 'Séance découverte' : `Séance ${seance.id}`

  return (
    <Feuille titre={titre} onFermer={onFermer}>
      <div className="apercu__intro">
        <p className="apercu__sous-titre">{seance.titre}</p>
        <p className="texte-2 apercu__meta">
          {pluriel(exercices.length, 'exercice')} · {series} séries · {choix.decouverte ? '~50 min' : seance.duree}
          {choix.allegee && ' · semaine légère'}
        </p>
        <p className="apercu__note">
          Touche un exercice pour voir sa démo et la technique. D’une séance à l’autre, les séries et les reps
          restent les mêmes : c’est la charge qui monte.
        </p>
        <div className="apercu__reflexes">
          <p className="apercu__reflexes-titre">Les bons réflexes à la salle</p>
          <ul>
            {BONS_REFLEXES.map((conseil) => (
              <li key={conseil}>{conseil}</li>
            ))}
          </ul>
        </div>
      </div>
      <ol className="apercu__liste">
        {exercices.map((apercu, i) => {
          const exercice = EXERCICES.get(apercu.exerciceId)
          if (!exercice) return null
          return <ApercuExercice key={`${apercu.exerciceId}-${i}`} numero={i + 1} exercice={exercice} apercu={apercu} />
        })}
      </ol>
      {onCommencer && (
        <div className="apercu__action">
          <button type="button" className="bouton bouton--bleu" onClick={onCommencer}>
            <Play size={20} fill="currentColor" aria-hidden="true" />
            Commencer cette séance
          </button>
        </div>
      )}
    </Feuille>
  )
}
