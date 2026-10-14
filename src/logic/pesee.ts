import { CYCLE } from '../data/cycle'
import type { Pesee } from '../data/types'
import { ajouterJours, jourSemaine, lundiDeLaSemaine } from './dates'

const VENDREDI = 5

export interface Tendance {
  derniere: number
  /** Écart avec la pesée précédente, null s'il n'y en a qu'une. */
  delta: number | null
  dernieres: number[]
}

export function estJourDePesee(iso: string): boolean {
  return jourSemaine(iso) === VENDREDI
}

export function peseeDeLaSemaine(pesees: readonly Pesee[], iso: string): Pesee | null {
  const lundi = lundiDeLaSemaine(iso)
  return pesees.find((p) => lundiDeLaSemaine(p.date) === lundi) ?? null
}

export function doitRappelerPesee(pesees: readonly Pesee[], iso: string): boolean {
  return estJourDePesee(iso) && peseeDeLaSemaine(pesees, iso) === null
}

/** Une pesée par semaine : remplace celle de la même semaine, sinon ajoute, puis trie. */
export function enregistrerPesee(pesees: readonly Pesee[], nouvelle: Pesee): Pesee[] {
  const lundi = lundiDeLaSemaine(nouvelle.date)
  return [...pesees.filter((p) => lundiDeLaSemaine(p.date) !== lundi), nouvelle].sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

export function tendance(pesees: readonly Pesee[], champ: 'poids' | 'taille'): Tendance | null {
  if (pesees.length === 0) return null
  const valeurs = pesees.map((p) => p[champ])
  const derniere = valeurs[valeurs.length - 1]
  const precedente = valeurs.length > 1 ? valeurs[valeurs.length - 2] : null
  return {
    derniere,
    delta: precedente === null ? null : Math.round((derniere - precedente) * 100) / 100,
    dernieres: valeurs.slice(-3),
  }
}

/** Photos : le jour de la découverte, puis le vendredi des semaines 6 et 12. */
export function estJourPhotos(iso: string): boolean {
  const vendredi = (semaine: number) => ajouterJours(CYCLE.debut, (semaine - 1) * 7 + 4)
  return iso === CYCLE.decouverte || iso === vendredi(CYCLE.pointEtape) || iso === vendredi(CYCLE.bilan)
}
