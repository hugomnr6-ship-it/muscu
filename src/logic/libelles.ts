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
