import { EXERCICES_BASE } from '../data/exercices'
import type { Seance, SeanceFaite } from '../data/types'
import { nombreDeSeries } from './seance'
import { derniereFois, suggererCharge, type DerniereFois, type Suggestion } from './suggestion'

export interface ExerciceApercu {
  exerciceId: string
  series: number
  reps: readonly [number, number]
  reposSec: number
  derniere: DerniereFois | null
  suggestion: Suggestion
}

/** Ce qui attend l'utilisateur dans une séance, sans la commencer. */
export function apercuSeance(
  seance: Seance,
  historique: readonly SeanceFaite[],
  options: { decouverte: boolean; allegee: boolean },
): ExerciceApercu[] {
  return seance.exercices.map((prevu) => {
    const base = EXERCICES_BASE.get(prevu.exerciceId)
    const derniere = derniereFois(historique, prevu.exerciceId)
    return {
      exerciceId: prevu.exerciceId,
      series: nombreDeSeries(prevu.series, options),
      reps: prevu.reps,
      reposSec: prevu.reposSec,
      derniere,
      suggestion: suggererCharge(derniere?.series ?? null, prevu.reps, base?.typeCharge ?? 'charge', base?.pasKg ?? 2.5),
    }
  })
}
