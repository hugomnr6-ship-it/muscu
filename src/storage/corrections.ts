import type { Donnees, SeanceFaite } from '../data/types'

/** Exercice noté sous le mauvais nom un jour donné : ses séries sont rangées sous le bon. */
export interface Correction {
  date: string
  de: string
  vers: string
}

export const CORRECTIONS: readonly Correction[] = [
  // Pec deck fait sur la machine « Pectoraux / Deltoïde arrière », mais noté sous « Oiseau ».
  { date: '2026-10-21', de: 'oiseau-machine', vers: 'pec-deck' },
]

function corrigerSeance(seance: SeanceFaite, { date, de, vers }: Correction): SeanceFaite {
  if (seance.date !== date) return seance
  const source = seance.exercices.find((e) => e.exerciceId === de)
  const cible = seance.exercices.find((e) => e.exerciceId === vers)
  if (!source || source.series.length === 0 || (cible && cible.series.length > 0)) return seance
  return {
    ...seance,
    exercices: seance.exercices
      .filter((e) => e.exerciceId !== vers)
      .map((e) => (e.exerciceId === de ? { ...e, exerciceId: vers } : e)),
  }
}

/** Sans effet (même objet renvoyé) quand rien n'est à corriger : on peut l'appeler à chaque lancement. */
export function appliquerCorrections(donnees: Donnees, corrections: readonly Correction[] = CORRECTIONS): Donnees {
  const historique = donnees.historique.map((seance) => corrections.reduce(corrigerSeance, seance))
  const change = historique.some((seance, i) => seance !== donnees.historique[i])
  return change ? { ...donnees, historique } : donnees
}
