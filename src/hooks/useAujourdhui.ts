import { useEffect, useState } from 'react'
import { enISO } from '../logic/dates'

const DATE = /^\d{4}-\d{2}-\d{2}$/

/** Date du jour (YYYY-MM-DD). `?date=2026-10-16` dans l'URL simule un autre jour. */
function lireDate(): string {
  const simulee = new URLSearchParams(window.location.search).get('date')
  return simulee && DATE.test(simulee) ? simulee : enISO(new Date())
}

/** Vrai si l'URL simule un autre jour (affiché en bandeau pour éviter les confusions). */
export function dateSimulee(): boolean {
  return DATE.test(new URLSearchParams(window.location.search).get('date') ?? '')
}

export function useAujourdhui(): string {
  const [date, setDate] = useState(lireDate)

  useEffect(() => {
    const rafraichir = () => setDate(lireDate())
    const minuterie = window.setInterval(rafraichir, 60_000)
    document.addEventListener('visibilitychange', rafraichir)
    return () => {
      window.clearInterval(minuterie)
      document.removeEventListener('visibilitychange', rafraichir)
    }
  }, [])

  return date
}
