import { EXERCICES_BASE } from './exercices'
import { MEDIAS } from './medias'
import type { Exercice } from './types'

export const EXERCICES: ReadonlyMap<string, Exercice> = new Map(
  [...EXERCICES_BASE].map(([id, base]) => [id, { ...base, ...MEDIAS[id] }]),
)

export function exercice(id: string): Exercice {
  const trouve = EXERCICES.get(id)
  if (!trouve) throw new Error(`Exercice inconnu : ${id}`)
  return trouve
}
