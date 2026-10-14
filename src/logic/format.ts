import type { TypeCharge } from '../data/types'

const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2, useGrouping: false })

export function nombreFr(valeur: number): string {
  return nombre.format(valeur)
}

export function chargeFr(kg: number, type: TypeCharge): string {
  if (type === 'poidsDuCorps') return kg === 0 ? 'PDC' : `+${nombreFr(kg)} kg`
  if (type === 'assistance') return `${nombreFr(kg)} kg d’aide`
  return `${nombreFr(kg)} kg`
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export function dateLongue(iso: string): string {
  const texte = dateFormat.format(new Date(`${iso}T12:00:00Z`))
  return texte.charAt(0).toUpperCase() + texte.slice(1)
}

export function dureeFr(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60_000))
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`
}

export function minuteurFr(secondes: number): string {
  return `${Math.floor(secondes / 60)}:${String(secondes % 60).padStart(2, '0')}`
}

export function reposFr(secondes: number): string {
  const minutes = Math.floor(secondes / 60)
  const reste = secondes % 60
  if (minutes === 0) return `${reste} s`
  return reste === 0 ? `${minutes} min` : `${minutes} min ${String(reste).padStart(2, '0')}`
}

export function repsFr(reps: readonly [number, number]): string {
  return reps[0] === reps[1] ? String(reps[0]) : `${reps[0]}-${reps[1]}`
}
