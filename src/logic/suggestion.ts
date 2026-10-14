import type { SeanceFaite, SerieFaite, TypeCharge } from '../data/types'

export type RaisonSuggestion = 'premiere' | 'augmente' | 'garde' | 'plusDeReps'

export interface Suggestion {
  /** Charge à essayer aujourd'hui, null la première fois. */
  kg: number | null
  delta: number
  raison: RaisonSuggestion
}

export interface DerniereFois {
  date: string
  series: SerieFaite[]
}

const arrondi = (valeur: number): number => Math.round(valeur * 100) / 100

/** Charge de référence : la plus lourde, ou l'aide la plus faible pour les tractions assistées. */
export function meilleureCharge(series: readonly SerieFaite[], type: TypeCharge): number {
  const charges = series.map((serie) => serie.kg)
  return type === 'assistance' ? Math.min(...charges) : Math.max(...charges)
}

/**
 * Charge de travail : celle utilisée sur le plus de séries. À égalité, la plus exigeante
 * (la plus lourde, ou l'aide la plus faible), car c'est la plus récente progression.
 */
export function chargeDeTravail(series: readonly SerieFaite[], type: TypeCharge): number {
  const compte = new Map<number, number>()
  for (const serie of series) compte.set(serie.kg, (compte.get(serie.kg) ?? 0) + 1)
  const plusExigeante = (a: number, b: number) => (type === 'assistance' ? Math.min(a, b) : Math.max(a, b))
  let reference = series[0].kg
  for (const [kg, nombre] of compte) {
    const actuel = compte.get(reference) ?? 0
    if (nombre > actuel || (nombre === actuel && plusExigeante(kg, reference) === kg)) reference = kg
  }
  return reference
}

/**
 * Double progression pour débutant : si toutes les séries faites à la charge de travail
 * atteignent le haut de la fourchette, on monte d'un cran (ou on réduit l'aide) ; sinon on garde.
 */
export function suggererCharge(
  derniere: readonly SerieFaite[] | null,
  reps: readonly [number, number],
  type: TypeCharge,
  pasKg: number,
): Suggestion {
  if (!derniere || derniere.length === 0) return { kg: null, delta: 0, raison: 'premiere' }
  const reference = chargeDeTravail(derniere, type)
  const toutAuMax = derniere.filter((serie) => serie.kg === reference).every((serie) => serie.reps >= reps[1])
  if (!toutAuMax) return { kg: reference, delta: 0, raison: 'garde' }
  if (type === 'poidsDuCorps') return { kg: reference, delta: 0, raison: 'plusDeReps' }
  const cible = arrondi(type === 'assistance' ? Math.max(0, reference - pasKg) : reference + pasKg)
  if (cible === reference) return { kg: reference, delta: 0, raison: 'plusDeReps' }
  return { kg: cible, delta: arrondi(cible - reference), raison: 'augmente' }
}

export function derniereFois(historique: readonly SeanceFaite[], exerciceId: string): DerniereFois | null {
  const triees = [...historique].sort((a, b) => b.fin - a.fin)
  for (const seance of triees) {
    const exercice = seance.exercices.find((e) => e.exerciceId === exerciceId)
    if (exercice && exercice.series.length > 0) return { date: seance.date, series: exercice.series }
  }
  return null
}
