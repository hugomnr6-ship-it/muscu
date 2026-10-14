import { EXERCICES_BASE } from '../data/exercices'
import type { ExerciceEnCours, Seance, SeanceEnCours, SeanceFaite, SerieEnCours, SerieFaite, TypeCharge } from '../data/types'
import { ajouterTemps } from './minuteur'
import { derniereFois, suggererCharge, type Suggestion } from './suggestion'

export interface OptionsSeance {
  date: string
  now: number
  decouverte: boolean
  allegee: boolean
}

export type ChampSerie = 'kg' | 'reps'

export type ActionSeance =
  | { type: 'ajuster'; champ: ChampSerie; delta: number }
  | { type: 'definir'; champ: ChampSerie; valeur: number }
  | { type: 'valider'; now: number }
  | { type: 'ajouterRepos'; now: number; secondes: number }
  | { type: 'passerRepos' }
  | { type: 'suivant' }
  | { type: 'allerA'; index: number }
  | { type: 'rouvrir'; serie: number }

const SERIES_DECOUVERTE = 2
const SERIES_MIN = 2
/** Aide de départ prudente pour les tractions assistées (0 kg d'aide = le plus dur). */
const AIDE_DEPART_KG = 30
/** Une séance oubliée ouverte s'arrête 5 min après la dernière série validée. */
const MARGE_FIN_MS = 5 * 60_000

const arrondi = (valeur: number): number => Math.round(valeur * 100) / 100

export function nombreDeSeries(prevues: number, options: Pick<OptionsSeance, 'decouverte' | 'allegee'>): number {
  if (options.decouverte) return SERIES_DECOUVERTE
  if (options.allegee) return Math.max(SERIES_MIN, prevues - 1)
  return prevues
}

function chargeDeDepart(suggestion: Suggestion, type: TypeCharge): number {
  if (suggestion.kg !== null) return suggestion.kg
  return type === 'assistance' ? AIDE_DEPART_KG : 0
}

/**
 * Reps pré-remplies : milieu de fourchette la 1re fois, bas de fourchette après une hausse de charge,
 * sinon les reps de la même série la dernière fois (jamais le haut par défaut, pour ne pas fausser la suggestion).
 */
function repsDeDepart(
  index: number,
  reps: readonly [number, number],
  suggestion: Suggestion,
  derniere: readonly SerieFaite[] | null,
): number {
  if (!derniere || derniere.length === 0) return Math.ceil((reps[0] + reps[1]) / 2)
  if (suggestion.raison === 'augmente') return reps[0]
  return (derniere[index] ?? derniere[derniere.length - 1]).reps
}

export function creerSeance(seance: Seance, historique: readonly SeanceFaite[], options: OptionsSeance): SeanceEnCours {
  const exercices: ExerciceEnCours[] = seance.exercices.map((prevu) => {
    const base = EXERCICES_BASE.get(prevu.exerciceId)
    const type = base?.typeCharge ?? 'charge'
    const derniere = derniereFois(historique, prevu.exerciceId)?.series ?? null
    const suggestion = suggererCharge(derniere, prevu.reps, type, base?.pasKg ?? 2.5)
    const kg = chargeDeDepart(suggestion, type)
    const series: SerieEnCours[] = Array.from({ length: nombreDeSeries(prevu.series, options) }, (_, i) => ({
      kg,
      reps: repsDeDepart(i, prevu.reps, suggestion, derniere),
      faite: false,
    }))
    return { exerciceId: prevu.exerciceId, reps: prevu.reps, reposSec: prevu.reposSec, series }
  })
  return {
    id: `${options.date}-${seance.id}-${options.now}`,
    seanceId: seance.id,
    date: options.date,
    debut: options.now,
    decouverte: options.decouverte,
    allegee: options.allegee,
    index: 0,
    exercices,
    derniereAction: options.now,
    reposFinA: null,
    reposDuree: 0,
  }
}

/** Index de la première série non faite, -1 si tout est fait. */
export function serieCourante(exercice: ExerciceEnCours): number {
  return exercice.series.findIndex((serie) => !serie.faite)
}

export function toutesFaites(exercice: ExerciceEnCours): boolean {
  return serieCourante(exercice) === -1
}

function majExercice(seance: SeanceEnCours, maj: (exercice: ExerciceEnCours) => ExerciceEnCours): SeanceEnCours {
  return {
    ...seance,
    exercices: seance.exercices.map((exercice, i) => (i === seance.index ? maj(exercice) : exercice)),
  }
}

function majSerieCourante(seance: SeanceEnCours, maj: (serie: SerieEnCours) => SerieEnCours): SeanceEnCours {
  const exercice = seance.exercices[seance.index]
  const courante = serieCourante(exercice)
  if (courante === -1) return seance
  return majExercice(seance, (e) => ({
    ...e,
    series: e.series.map((serie, i) => (i === courante ? maj(serie) : serie)),
  }))
}

function borner(valeur: number): number {
  return arrondi(Math.max(0, valeur))
}

function valider(seance: SeanceEnCours, now: number): SeanceEnCours {
  const exercice = seance.exercices[seance.index]
  const courante = serieCourante(exercice)
  if (courante === -1) return seance
  const validee = exercice.series[courante]
  const series = exercice.series.map((serie, i) => {
    if (i === courante) return { ...serie, faite: true }
    if (i === courante + 1) return { ...serie, kg: validee.kg }
    return serie
  })
  const resteDesSeries = courante + 1 < series.length
  return {
    ...majExercice(seance, (e) => ({ ...e, series })),
    derniereAction: now,
    reposFinA: resteDesSeries ? now + exercice.reposSec * 1000 : null,
    reposDuree: resteDesSeries ? exercice.reposSec : 0,
  }
}

function rouvrir(seance: SeanceEnCours, index: number): SeanceEnCours {
  const exercice = seance.exercices[seance.index]
  if (!exercice.series[index]?.faite) return seance
  return majExercice(seance, (e) => ({
    ...e,
    series: e.series.map((serie, i) => (i === index ? { ...serie, faite: false } : serie)),
  }))
}

function allerA(seance: SeanceEnCours, index: number): SeanceEnCours {
  const borne = Math.min(Math.max(0, index), seance.exercices.length - 1)
  return borne === seance.index ? seance : { ...seance, index: borne }
}

export function reducteurSeance(seance: SeanceEnCours, action: ActionSeance): SeanceEnCours {
  switch (action.type) {
    case 'ajuster':
      return majSerieCourante(seance, (serie) => ({ ...serie, [action.champ]: borner(serie[action.champ] + action.delta) }))
    case 'definir':
      if (!Number.isFinite(action.valeur)) return seance
      return majSerieCourante(seance, (serie) => ({ ...serie, [action.champ]: borner(action.valeur) }))
    case 'valider':
      return valider(seance, action.now)
    case 'ajouterRepos': {
      const reposFinA = ajouterTemps(seance.reposFinA, action.now, action.secondes)
      const reposDuree = Math.max(seance.reposDuree, Math.ceil((reposFinA - action.now) / 1000))
      return { ...seance, reposFinA, reposDuree }
    }
    case 'passerRepos':
      return { ...seance, reposFinA: null }
    case 'suivant':
      return allerA(seance, seance.index + 1)
    case 'allerA':
      return allerA(seance, action.index)
    case 'rouvrir':
      return rouvrir(seance, action.serie)
  }
}

export function terminerSeance(seance: SeanceEnCours, now: number): SeanceFaite {
  return {
    id: seance.id,
    seanceId: seance.seanceId,
    date: seance.date,
    debut: seance.debut,
    fin: Math.min(now, seance.derniereAction + MARGE_FIN_MS),
    decouverte: seance.decouverte,
    exercices: seance.exercices
      .map((exercice) => ({
        exerciceId: exercice.exerciceId,
        series: exercice.series.filter((serie) => serie.faite).map(({ kg, reps }) => ({ kg, reps })),
      }))
      .filter((exercice) => exercice.series.length > 0),
  }
}
