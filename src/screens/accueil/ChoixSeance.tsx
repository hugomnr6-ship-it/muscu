import { Feuille } from '../../components/Feuille'
import { SEANCES } from '../../data/programme'
import type { SeanceId } from '../../data/types'
import { pluriel } from '../../logic/libelles'

interface ChoixSeanceProps {
  onChoisir: (seanceId: SeanceId) => void
  onFermer: () => void
}

export function ChoixSeance({ onChoisir, onFermer }: ChoixSeanceProps) {
  return (
    <Feuille titre="Quelle séance ?" onFermer={onFermer}>
      <p className="texte-2 feuille__intro">Tu as raté un jour ou tu veux décaler ? Choisis la séance à faire.</p>
      {Object.values(SEANCES).map((seance) => (
        <button key={seance.id} type="button" className="choix-seance" onClick={() => onChoisir(seance.id)}>
          <span className="choix-seance__lettre">{seance.id}</span>
          <span>
            <span className="choix-seance__titre">{seance.titre}</span>
            <span className="choix-seance__meta">
              {pluriel(seance.exercices.length, 'exercice')} · {seance.duree}
            </span>
          </span>
        </button>
      ))}
    </Feuille>
  )
}
