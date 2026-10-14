import { minuteurFr } from '../../logic/format'
import { pourcentage } from '../../logic/minuteur'

interface BarreActionProps {
  reposRestant: number
  reposDuree: number
  exerciceFini: boolean
  dernierExercice: boolean
  onAjouterRepos: () => void
  onPasserRepos: () => void
  onSuivant: () => void
}

export function BarreAction(props: BarreActionProps) {
  const { reposRestant, reposDuree, exerciceFini, dernierExercice, onAjouterRepos, onPasserRepos, onSuivant } = props
  const libelle = dernierExercice ? 'Terminer la séance' : 'Exercice suivant'

  return (
    <div className="barre-action">
      {reposRestant > 0 && (
        <div className="repos" role="timer" aria-label={`Repos : ${minuteurFr(reposRestant)}`}>
          <span className="repos__jauge" style={{ width: `${pourcentage(reposRestant, reposDuree)}%` }} />
          <span className="repos__texte">
            Repos <span className="repos__temps">{minuteurFr(reposRestant)}</span>
          </span>
          <button type="button" className="repos__bouton" onClick={onAjouterRepos}>
            +30 s
          </button>
          <button type="button" className="repos__bouton repos__bouton--bleu" onClick={onPasserRepos}>
            Passer
          </button>
        </div>
      )}
      <button type="button" className={`bouton${exerciceFini ? ' bouton--principal' : ''}`} onClick={onSuivant}>
        {libelle}
      </button>
    </div>
  )
}
