import { ArrowLeftRight, ChevronRight } from 'lucide-react'
import { useId, useState } from 'react'
import { PLAN_B_GENERAL } from '../data/exercices'
import type { Exercice } from '../data/types'

interface InfosMachineProps {
  exercice: Exercice
}

/** À quoi ressemble la machine, et quoi faire si elle est occupée ou introuvable. */
export function InfosMachine({ exercice }: InfosMachineProps) {
  return (
    <div className="infos-machine">
      {exercice.machine && <p>{exercice.machine.aspect}</p>}
      <p>
        <span className="infos-machine__label">Occupée ?</span> {PLAN_B_GENERAL}
      </p>
      {exercice.planB && (
        <p>
          <span className="infos-machine__label">Introuvable ?</span> {exercice.planB}
        </p>
      )}
    </div>
  )
}

interface FicheMachineProps {
  exercice: Exercice
  /** Ouverte la première fois, quand la machine n'est pas encore connue. */
  ouverteAuDepart: boolean
  /** Exercice du plan B, proposé tant qu'aucune série n'est faite. */
  remplacant?: Exercice | null
  onRemplacer?: () => void
}

/** Pendant la séance : le nom écrit sur la machine, dépliable pour savoir la reconnaître. */
export function FicheMachine({ exercice, ouverteAuDepart, remplacant, onRemplacer }: FicheMachineProps) {
  const [ouverte, setOuverte] = useState(ouverteAuDepart)
  const idContenu = useId()
  if (!exercice.machine) return null

  return (
    <div className={`fiche-machine${ouverte ? ' fiche-machine--ouverte' : ''}`}>
      <button
        type="button"
        className="fiche-machine__bouton"
        aria-expanded={ouverte}
        aria-controls={idContenu}
        onClick={() => setOuverte((o) => !o)}
      >
        <span className="fiche-machine__texte">
          <span className="fiche-machine__libelle">Écrit sur la machine</span>
          <span className="fiche-machine__nom">{exercice.machine.nom}</span>
        </span>
        <ChevronRight className="fiche-machine__chevron" size={22} aria-hidden="true" />
      </button>
      {ouverte && (
        <div id={idContenu} className="fiche-machine__contenu">
          <InfosMachine exercice={exercice} />
          {remplacant && onRemplacer && (
            <button type="button" className="fiche-machine__remplacer" onClick={onRemplacer}>
              <ArrowLeftRight size={18} aria-hidden="true" />
              Faire plutôt : {remplacant.court}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
