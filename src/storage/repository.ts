import type { Donnees } from '../data/types'
import { validerDonnees } from './validation'

export const CLE = 'muscu:donnees'
export const CLE_CORROMPUE = 'muscu:donnees-illisibles'

/** Sous-ensemble de `Storage` utilisé (facilite les tests). */
export interface Stockage {
  getItem(cle: string): string | null
  setItem(cle: string, valeur: string): void
}

export type ResultatImport = { ok: true; donnees: Donnees } | { ok: false; erreur: string }

export function donneesVides(): Donnees {
  return { version: 1, historique: [], pesees: [], activites: {}, seanceEnCours: null }
}

/** Lit les données ; si elles sont illisibles, les met de côté plutôt que de les écraser. */
export function charger(stockage: Stockage): Donnees {
  const brut = stockage.getItem(CLE)
  if (brut === null) return donneesVides()
  try {
    const donnees = validerDonnees(JSON.parse(brut))
    if (donnees) return donnees
  } catch {
    // JSON invalide : traité comme des données corrompues ci-dessous.
  }
  stockage.setItem(CLE_CORROMPUE, brut)
  return donneesVides()
}

export function sauvegarder(stockage: Stockage, donnees: Donnees): void {
  stockage.setItem(CLE, JSON.stringify(donnees))
}

export function exporter(donnees: Donnees): string {
  return JSON.stringify({ app: 'muscu', exporteLe: new Date().toISOString(), donnees }, null, 2)
}

export function importer(texte: string): ResultatImport {
  let contenu: unknown
  try {
    contenu = JSON.parse(texte)
  } catch {
    return { ok: false, erreur: 'Ce fichier n’est pas une sauvegarde de l’appli.' }
  }
  if (typeof contenu !== 'object' || contenu === null || (contenu as { app?: unknown }).app !== 'muscu') {
    return { ok: false, erreur: 'Ce fichier n’est pas une sauvegarde de l’appli.' }
  }
  const donnees = validerDonnees((contenu as { donnees?: unknown }).donnees)
  if (!donnees) return { ok: false, erreur: 'La sauvegarde est abîmée : rien n’a été importé.' }
  return { ok: true, donnees }
}
