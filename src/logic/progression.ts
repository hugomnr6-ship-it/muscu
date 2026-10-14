import type { SeanceFaite, TypeCharge } from '../data/types'
import { semaineDuCycle } from './cycle'
import { meilleureCharge } from './suggestion'

export interface PointProgression {
  date: string
  kg: number
  semaine: number
}

export interface GeometrieCourbe {
  ligne: string
  aire: string
  /** Position du dernier point en % de la largeur (l) et de la hauteur (t). */
  dernier: { l: number; t: number }
}

export function pointsProgression(
  historique: readonly SeanceFaite[],
  exerciceId: string,
  type: TypeCharge,
  maximum = 8,
): PointProgression[] {
  return [...historique]
    .sort((a, b) => a.fin - b.fin)
    .flatMap((seance) => {
      const exercice = seance.exercices.find((e) => e.exerciceId === exerciceId)
      if (!exercice || exercice.series.length === 0) return []
      return [{ date: seance.date, kg: meilleureCharge(exercice.series, type), semaine: semaineDuCycle(seance.date) }]
    })
    .slice(-maximum)
}

/** Géométrie de la courbe de la maquette (viewBox 320×130, marges de 8). */
export function geometrieCourbe(valeurs: readonly number[], largeur = 320, hauteur = 130): GeometrieCourbe | null {
  if (valeurs.length === 0) return null
  const serie = valeurs.length === 1 ? [valeurs[0], valeurs[0]] : valeurs
  const bas = Math.min(...serie)
  const haut = Math.max(...serie)
  const etendue = haut - bas
  const marge = etendue === 0 ? 1 : etendue * 0.18
  const points = serie.map((valeur, i) => {
    const x = 8 + (i * (largeur - 16)) / (serie.length - 1)
    const y = 8 + (1 - (valeur - bas + marge) / (etendue + 2 * marge)) * (hauteur - 16)
    return [x, y] as const
  })
  const ligne = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [dx, dy] = points[points.length - 1]
  return {
    ligne,
    aire: `M8,${hauteur} L${ligne.split(' ').join(' L')} L${largeur - 8},${hauteur} Z`,
    dernier: { l: (dx / largeur) * 100, t: (dy / hauteur) * 100 },
  }
}
