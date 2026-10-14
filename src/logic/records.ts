import { EXERCICES_BASE } from '../data/exercices'
import type { SeanceFaite, SerieFaite, TypeCharge } from '../data/types'

export interface MeilleurePerf {
  kg: number
  reps: number
  date: string
}

function typeDe(exerciceId: string): TypeCharge {
  return EXERCICES_BASE.get(exerciceId)?.typeCharge ?? 'charge'
}

/** Vrai si la série `a` est meilleure que le record `b` pour ce type de charge. */
function estMeilleure(a: SerieFaite, b: MeilleurePerf | undefined, type: TypeCharge): boolean {
  if (!b) return true
  if (a.kg === b.kg) return a.reps > b.reps
  return type === 'assistance' ? a.kg < b.kg : a.kg > b.kg
}

export function calculerRecords(historique: readonly SeanceFaite[]): Map<string, MeilleurePerf> {
  const records = new Map<string, MeilleurePerf>()
  const chronologique = [...historique].sort((a, b) => a.fin - b.fin)
  for (const seance of chronologique) {
    for (const exercice of seance.exercices) {
      const type = typeDe(exercice.exerciceId)
      for (const serie of exercice.series) {
        if (serie.reps <= 0) continue
        if (estMeilleure(serie, records.get(exercice.exerciceId), type)) {
          records.set(exercice.exerciceId, { kg: serie.kg, reps: serie.reps, date: seance.date })
        }
      }
    }
  }
  return records
}

/** Exercices dont le record est battu par `seance` (hors première fois). */
export function nouveauxRecords(historiqueAvant: readonly SeanceFaite[], seance: SeanceFaite): string[] {
  const avant = calculerRecords(historiqueAvant)
  return seance.exercices
    .filter((exercice) => {
      const precedent = avant.get(exercice.exerciceId)
      if (!precedent) return false
      const type = typeDe(exercice.exerciceId)
      return exercice.series.some((serie) => serie.reps > 0 && estMeilleure(serie, precedent, type))
    })
    .map((exercice) => exercice.exerciceId)
}

export function premieresFois(historiqueAvant: readonly SeanceFaite[], seance: SeanceFaite): string[] {
  const dejaFaits = new Set(historiqueAvant.flatMap((s) => s.exercices.filter((e) => e.series.length > 0).map((e) => e.exerciceId)))
  return seance.exercices
    .filter((exercice) => exercice.series.length > 0 && !dejaFaits.has(exercice.exerciceId))
    .map((exercice) => exercice.exerciceId)
}
