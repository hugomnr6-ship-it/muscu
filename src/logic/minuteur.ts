/** Secondes restantes avant `finA` (arrondi au supérieur, jamais négatif). */
export function restant(finA: number | null, maintenant: number): number {
  if (finA === null) return 0
  return Math.max(0, Math.ceil((finA - maintenant) / 1000))
}

/** Ajoute du temps au repos en cours, ou en relance un s'il est fini. */
export function ajouterTemps(finA: number | null, maintenant: number, secondes: number): number {
  const base = finA !== null && finA > maintenant ? finA : maintenant
  return base + secondes * 1000
}

export function pourcentage(restantSec: number, totalSec: number): number {
  if (totalSec <= 0) return 0
  return Math.min(100, Math.round((restantSec / totalSec) * 100))
}
