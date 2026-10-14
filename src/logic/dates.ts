/** Dates locales au format YYYY-MM-DD, calculées en UTC pour ignorer les changements d'heure. */

const MS_PAR_JOUR = 86_400_000

function versUTC(iso: string): number {
  const [annee, mois, jour] = iso.split('-').map(Number)
  return Date.UTC(annee, mois - 1, jour)
}

function depuisUTC(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export function enISO(date: Date): string {
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mois}-${jour}`
}

/** 1 = lundi … 7 = dimanche */
export function jourSemaine(iso: string): number {
  const jour = new Date(versUTC(iso)).getUTCDay()
  return jour === 0 ? 7 : jour
}

export function ajouterJours(iso: string, jours: number): string {
  return depuisUTC(versUTC(iso) + jours * MS_PAR_JOUR)
}

export function ecartJours(de: string, a: string): number {
  return Math.round((versUTC(a) - versUTC(de)) / MS_PAR_JOUR)
}

export function lundiDeLaSemaine(iso: string): string {
  return ajouterJours(iso, 1 - jourSemaine(iso))
}
