import { CYCLE } from '../data/cycle'
import { SEANCES } from '../data/programme'
import type { SeanceId } from '../data/types'
import { infoCycle, programmeDuJour } from './cycle'
import { ajouterJours, lundiDeLaSemaine } from './dates'
import { estJourDePesee, estJourPhotos } from './pesee'

export type TypeTache = 'muscu' | 'tennis' | 'padel' | 'repos' | 'pesee' | 'photos' | 'point' | 'bilan' | 'legere'

/** Séance à prévisualiser (avec ses variantes découverte / semaine légère). */
export interface RefSeance {
  seanceId: SeanceId
  decouverte: boolean
  allegee: boolean
}

export interface Tache {
  type: TypeTache
  titre: string
  detail?: string
  seance?: RefSeance
}

export interface JourAgenda {
  date: string
  taches: Tache[]
}

/** Vendredi d'une semaine du cycle (jour de pesée, de photos et des bilans). */
const vendrediDeLaSemaine = (semaine: number): string => ajouterJours(CYCLE.debut, (semaine - 1) * 7 + 4)
const lundiDeLaSemaineDuCycle = (semaine: number): string => ajouterJours(CYCLE.debut, (semaine - 1) * 7)

function activite(iso: string): Tache | null {
  const programme = programmeDuJour(iso)
  switch (programme.activite) {
    case 'avant':
      return null
    case 'muscu': {
      if (programme.decouverte) {
        return {
          type: 'muscu',
          titre: 'Séance découverte',
          detail: 'Séance C en 2 séries légères',
          seance: { seanceId: 'C', decouverte: true, allegee: false },
        }
      }
      const seance = SEANCES[programme.seanceId]
      const allegee = infoCycle(iso).allegee
      return {
        type: 'muscu',
        titre: `Séance ${seance.id}`,
        detail: `${seance.titre}${allegee ? ' · une série de moins' : ''}`,
        seance: { seanceId: seance.id, decouverte: false, allegee },
      }
    }
    case 'tennis':
      return { type: 'tennis', titre: 'Tennis' }
    case 'padel':
      return { type: 'padel', titre: 'Padel' }
    case 'repos':
      return { type: 'repos', titre: 'Repos' }
  }
}

/** Tout ce qui est prévu un jour donné : l'activité, puis les rendez-vous (pesée, photos, bilans). */
export function tachesDuJour(iso: string): Tache[] {
  const principale = activite(iso)
  if (!principale) return []
  const taches: Tache[] = [principale]
  if (estJourDePesee(iso)) taches.push({ type: 'pesee', titre: 'Pesée et tour de taille', detail: 'Le matin, à jeun' })
  if (estJourPhotos(iso)) taches.push({ type: 'photos', titre: 'Photos', detail: 'Face, profil, dos' })
  if (iso === vendrediDeLaSemaine(CYCLE.pointEtape)) {
    taches.push({ type: 'point', titre: 'Point d’étape', detail: 'Exporte ta sauvegarde et fais le point avec Claude' })
  }
  if (iso === vendrediDeLaSemaine(CYCLE.bilan)) {
    taches.push({ type: 'bilan', titre: 'Bilan des 12 semaines', detail: 'Avant / après, puis on prépare la phase 2' })
  }
  if (iso === lundiDeLaSemaineDuCycle(CYCLE.allegee)) {
    taches.push({ type: 'legere', titre: 'Début de la semaine légère', detail: 'Le corps récupère avant le bilan' })
  }
  return taches
}

export function joursDeLaSemaine(iso: string): JourAgenda[] {
  const lundi = lundiDeLaSemaine(iso)
  return Array.from({ length: 7 }, (_, i) => {
    const date = ajouterJours(lundi, i)
    return { date, taches: tachesDuJour(date) }
  })
}

/** Les `nombre` prochains jours (après aujourd'hui) où quelque chose est prévu. */
export function prochainsJours(iso: string, nombre: number, horizonJours = 14): JourAgenda[] {
  const jours: JourAgenda[] = []
  for (let i = 1; i <= horizonJours && jours.length < nombre; i++) {
    const date = ajouterJours(iso, i)
    const taches = tachesDuJour(date)
    if (taches.length > 0) jours.push({ date, taches })
  }
  return jours
}
