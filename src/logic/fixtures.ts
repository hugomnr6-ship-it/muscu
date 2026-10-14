import type { SeanceFaite, SerieFaite } from '../data/types'

/** Fabrique une séance faite minimale pour les tests. */
export function seanceFaite(
  date: string,
  exercices: Record<string, SerieFaite[]>,
  seanceId: SeanceFaite['seanceId'] = 'A',
): SeanceFaite {
  const debut = new Date(`${date}T18:00:00`).getTime()
  return {
    id: `s-${date}-${seanceId}`,
    seanceId,
    date,
    debut,
    fin: debut + 70 * 60_000,
    decouverte: false,
    exercices: Object.entries(exercices).map(([exerciceId, series]) => ({ exerciceId, series })),
  }
}

export const s = (kg: number, reps: number): SerieFaite => ({ kg, reps })
