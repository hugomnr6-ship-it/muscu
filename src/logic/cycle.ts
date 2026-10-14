import { CYCLE } from '../data/cycle'
import { PLANNING, SEANCE_PAR_JOUR } from '../data/programme'
import type { SeanceId } from '../data/types'
import { ajouterJours, ecartJours, jourSemaine } from './dates'

export type ProgrammeDuJour =
  | { activite: 'muscu'; seanceId: SeanceId; decouverte: boolean }
  | { activite: 'tennis' | 'padel' | 'repos' | 'avant' }

export interface Etape {
  type: 'point' | 'bilan'
  /** Nombre de semaines avant l'étape (0 = cette semaine). */
  dans: number
}

export interface InfoCycle {
  semaine: number
  termine: boolean
  allegee: boolean
  prochaineEtape: Etape | null
}

export type TypeSemaine = 'normale' | 'point' | 'allegee' | 'bilan'

export interface SemaineCycle {
  numero: number
  debut: string
  fin: string
  type: TypeSemaine
}

/** 0 = semaine découverte (ou avant), 1 à 12 = cycle, 13+ = cycle terminé. */
export function semaineDuCycle(iso: string): number {
  const ecart = ecartJours(CYCLE.debut, iso)
  return ecart < 0 ? 0 : Math.floor(ecart / 7) + 1
}

export function infoCycle(iso: string): InfoCycle {
  const semaine = semaineDuCycle(iso)
  const termine = semaine > CYCLE.semaines
  let prochaineEtape: Etape | null = null
  if (semaine <= CYCLE.pointEtape) prochaineEtape = { type: 'point', dans: CYCLE.pointEtape - semaine }
  else if (!termine) prochaineEtape = { type: 'bilan', dans: CYCLE.bilan - semaine }
  return { semaine, termine, allegee: semaine === CYCLE.allegee, prochaineEtape }
}

export function programmeDuJour(iso: string): ProgrammeDuJour {
  if (iso === CYCLE.decouverte) return { activite: 'muscu', seanceId: 'C', decouverte: true }
  if (ecartJours(CYCLE.decouverte, iso) < 0) return { activite: 'avant' }
  const jour = jourSemaine(iso)
  const activite = PLANNING[jour]
  if (activite === 'muscu') return { activite, seanceId: SEANCE_PAR_JOUR[jour], decouverte: false }
  return { activite }
}

export function prochaineSeanceMuscu(iso: string): { date: string; seanceId: SeanceId } {
  if (ecartJours(iso, CYCLE.decouverte) > 0) return { date: CYCLE.decouverte, seanceId: 'C' }
  for (let i = 1; i <= 7; i++) {
    const date = ajouterJours(iso, i)
    const programme = programmeDuJour(date)
    if (programme.activite === 'muscu') return { date, seanceId: programme.seanceId }
  }
  throw new Error('Aucune séance de muscu dans les 7 prochains jours')
}

function typeSemaine(numero: number): TypeSemaine {
  if (numero === CYCLE.pointEtape) return 'point'
  if (numero === CYCLE.allegee) return 'allegee'
  if (numero === CYCLE.bilan) return 'bilan'
  return 'normale'
}

export function semainesDuCycle(): SemaineCycle[] {
  return Array.from({ length: CYCLE.semaines }, (_, i) => {
    const debut = ajouterJours(CYCLE.debut, i * 7)
    return { numero: i + 1, debut, fin: ajouterJours(debut, 6), type: typeSemaine(i + 1) }
  })
}
