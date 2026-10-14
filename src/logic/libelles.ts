import type { Activite } from '../data/types'

const jourFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'UTC' })

/** « mercredi » pour une date YYYY-MM-DD. */
export function nomDuJour(iso: string): string {
  return jourFormat.format(new Date(`${iso}T12:00:00Z`))
}

export const LIBELLE_ACTIVITE: Readonly<Record<Activite, string>> = {
  muscu: 'Muscu',
  tennis: 'Tennis',
  padel: 'Padel',
  repos: 'Repos',
}

export const INITIALE_JOUR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const

export function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? 's' : ''}`
}

const jourCourt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** « Aujourd’hui », « Demain » ou « ven. 16 oct. » */
export function libelleJour(iso: string, aujourdhui: string): string {
  if (iso === aujourdhui) return 'Aujourd’hui'
  const demain = new Date(`${aujourdhui}T12:00:00Z`)
  demain.setUTCDate(demain.getUTCDate() + 1)
  if (iso === demain.toISOString().slice(0, 10)) return 'Demain'
  const texte = jourCourt.format(new Date(`${iso}T12:00:00Z`))
  return texte.charAt(0).toUpperCase() + texte.slice(1)
}
