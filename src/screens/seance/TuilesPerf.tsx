import type { Exercice } from '../../data/types'
import { chargeFr, nombreFr } from '../../logic/format'
import type { DerniereFois, Suggestion } from '../../logic/suggestion'
import { meilleureCharge } from '../../logic/suggestion'

interface TuilesPerfProps {
  exercice: Exercice
  derniere: DerniereFois | null
  suggestion: Suggestion
  decouverte: boolean
}

function detailSuggestion(suggestion: Suggestion, exercice: Exercice): string {
  if (suggestion.raison === 'plusDeReps') return 'Vise 1 rep de plus'
  if (suggestion.raison === 'garde') return 'Même charge, plus de reps'
  const signe = suggestion.delta > 0 ? '+' : '−'
  const aide = exercice.typeCharge === 'assistance' ? ' d’aide' : ''
  return `${signe}${nombreFr(Math.abs(suggestion.delta))} kg${aide}`
}

export function TuilesPerf({ exercice, derniere, suggestion, decouverte }: TuilesPerfProps) {
  return (
    <div className="tuiles">
      <div className="tuile">
        <div className="tuile__libelle">La dernière fois</div>
        {derniere ? (
          <>
            <div className="tuile__valeur">{chargeFr(meilleureCharge(derniere.series, exercice.typeCharge), exercice.typeCharge)}</div>
            <div className="tuile__detail">× {derniere.series.map((s) => s.reps).join(', ')}</div>
          </>
        ) : (
          <>
            <div className="tuile__valeur">Première fois</div>
            <div className="tuile__detail">Regarde la vidéo</div>
          </>
        )}
      </div>
      <div className="tuile tuile--bleue">
        <div className="tuile__libelle">Aujourd’hui : essaie</div>
        {suggestion.kg === null ? (
          <>
            <div className="tuile__valeur">Léger</div>
            <div className="tuile__detail">{decouverte ? 'Apprends le geste' : '12 reps faciles'}</div>
          </>
        ) : (
          <>
            <div className="tuile__valeur">{chargeFr(suggestion.kg, exercice.typeCharge)}</div>
            <div className="tuile__detail">{detailSuggestion(suggestion, exercice)}</div>
          </>
        )}
      </div>
    </div>
  )
}
