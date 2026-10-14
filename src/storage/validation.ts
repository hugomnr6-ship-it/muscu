import type {
  Donnees,
  ExerciceEnCours,
  ExerciceFait,
  Pesee,
  SeanceEnCours,
  SeanceFaite,
  SeanceId,
  SerieEnCours,
  SerieFaite,
  SportRaquette,
} from '../data/types'
import { EXERCICES_BASE } from '../data/exercices'
import { enregistrerPesee } from '../logic/pesee'

/** Validation manuelle des données relues (localStorage ou fichier importé) : on ne fait confiance à rien. */

type Objet = { [cle: string]: unknown }

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const KG_MAX = 1000
const REPS_MAX = 200
const REPOS_MAX_SEC = 3600
const SEANCES: readonly SeanceId[] = ['A', 'B', 'C']
const SPORTS: readonly SportRaquette[] = ['tennis', 'padel']

const estObjet = (x: unknown): x is Objet => typeof x === 'object' && x !== null && !Array.isArray(x)
const estNombre = (x: unknown, max = Number.MAX_SAFE_INTEGER): x is number =>
  typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= max
const estTexte = (x: unknown): x is string => typeof x === 'string' && x.length > 0 && x.length <= 200
const estExerciceConnu = (x: unknown): x is string => typeof x === 'string' && EXERCICES_BASE.has(x)

function estDate(x: unknown): x is string {
  const morceaux = typeof x === 'string' ? DATE.exec(x) : null
  if (!morceaux) return false
  const [annee, mois, jour] = morceaux.slice(1).map(Number)
  const date = new Date(Date.UTC(annee, mois - 1, jour))
  return date.getUTCFullYear() === annee && date.getUTCMonth() === mois - 1 && date.getUTCDate() === jour
}
const estSeanceId = (x: unknown): x is SeanceId => SEANCES.includes(x as SeanceId)

function liste<T>(x: unknown, valider: (e: unknown) => T | null): T[] | null {
  if (!Array.isArray(x)) return null
  const resultat: T[] = []
  for (const element of x) {
    const valide = valider(element)
    if (valide === null) return null
    resultat.push(valide)
  }
  return resultat
}

function serieFaite(x: unknown): SerieFaite | null {
  if (!estObjet(x) || !estNombre(x.kg, KG_MAX) || !estNombre(x.reps, REPS_MAX)) return null
  return { kg: x.kg, reps: x.reps }
}

function exerciceFait(x: unknown): ExerciceFait | null {
  if (!estObjet(x) || !estTexte(x.exerciceId)) return null
  const series = liste(x.series, serieFaite)
  return series ? { exerciceId: x.exerciceId, series } : null
}

function seanceFaite(x: unknown): SeanceFaite | null {
  if (!estObjet(x) || !estTexte(x.id) || !estSeanceId(x.seanceId) || !estDate(x.date)) return null
  if (!estNombre(x.debut) || !estNombre(x.fin) || typeof x.decouverte !== 'boolean') return null
  const exercices = liste(x.exercices, exerciceFait)
  if (!exercices) return null
  // Exercices retirés du programme depuis : ignorés plutôt que de faire planter l'affichage.
  const connus = exercices.filter((e) => estExerciceConnu(e.exerciceId))
  return { id: x.id, seanceId: x.seanceId, date: x.date, debut: x.debut, fin: x.fin, decouverte: x.decouverte, exercices: connus }
}

function pesee(x: unknown): Pesee | null {
  if (!estObjet(x) || !estDate(x.date) || !estNombre(x.poids, 500) || !estNombre(x.taille, 300)) return null
  return { date: x.date, poids: x.poids, taille: x.taille }
}

function activites(x: unknown): Record<string, SportRaquette> | null {
  if (!estObjet(x)) return null
  const resultat: Record<string, SportRaquette> = {}
  for (const [date, sport] of Object.entries(x)) {
    if (!estDate(date) || !SPORTS.includes(sport as SportRaquette)) return null
    resultat[date] = sport as SportRaquette
  }
  return resultat
}

function serieEnCours(x: unknown): SerieEnCours | null {
  if (!estObjet(x) || !estNombre(x.kg, KG_MAX) || !estNombre(x.reps, REPS_MAX) || typeof x.faite !== 'boolean') return null
  return { kg: x.kg, reps: x.reps, faite: x.faite }
}

function exerciceEnCours(x: unknown): ExerciceEnCours | null {
  if (!estObjet(x) || !estTexte(x.exerciceId) || !estNombre(x.reposSec, REPOS_MAX_SEC)) return null
  if (!Array.isArray(x.reps) || x.reps.length !== 2 || !x.reps.every((r) => estNombre(r, REPS_MAX))) return null
  const series = liste(x.series, serieEnCours)
  if (!series || series.length === 0) return null
  return { exerciceId: x.exerciceId, reps: [x.reps[0], x.reps[1]], reposSec: x.reposSec, series }
}

function seanceEnCours(x: unknown): SeanceEnCours | null {
  if (!estObjet(x) || !estTexte(x.id) || !estSeanceId(x.seanceId) || !estDate(x.date)) return null
  if (!estNombre(x.debut) || !estNombre(x.index) || !estNombre(x.reposDuree, REPOS_MAX_SEC)) return null
  if (typeof x.decouverte !== 'boolean' || typeof x.allegee !== 'boolean') return null
  if (x.reposFinA !== null && !estNombre(x.reposFinA)) return null
  if (x.derniereAction !== undefined && !estNombre(x.derniereAction)) return null
  const exercices = liste(x.exercices, exerciceEnCours)
  if (!exercices || exercices.length === 0 || x.index >= exercices.length) return null
  if (!exercices.every((e) => estExerciceConnu(e.exerciceId))) return null
  return {
    id: x.id,
    seanceId: x.seanceId,
    date: x.date,
    debut: x.debut,
    decouverte: x.decouverte,
    allegee: x.allegee,
    index: Math.floor(x.index),
    exercices,
    derniereAction: x.derniereAction ?? x.debut,
    reposFinA: x.reposFinA,
    reposDuree: x.reposDuree,
  }
}

/** Une séance en cours qui référence un exercice inconnu est abandonnée, le reste est gardé. */
function seanceEnCoursOuNull(x: unknown): SeanceEnCours | null | undefined {
  if (x === null) return null
  const valide = seanceEnCours(x)
  if (valide) return valide
  const exercicesInconnus =
    estObjet(x) && Array.isArray(x.exercices) && x.exercices.some((e) => estObjet(e) && !estExerciceConnu(e.exerciceId))
  return exercicesInconnus ? null : undefined
}

export function validerDonnees(x: unknown): Donnees | null {
  if (!estObjet(x) || x.version !== 1) return null
  const historique = liste(x.historique, seanceFaite)
  const listePesees = liste(x.pesees, pesee)
  const sports = activites(x.activites)
  const enCours = seanceEnCoursOuNull(x.seanceEnCours)
  if (!historique || !listePesees || !sports || enCours === undefined) return null
  return {
    version: 1,
    historique: historique.filter((s) => s.exercices.length > 0),
    pesees: listePesees.sort((a, b) => a.date.localeCompare(b.date)).reduce<Pesee[]>(enregistrerPesee, []),
    activites: sports,
    seanceEnCours: enCours,
  }
}
