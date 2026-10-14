import type { Activite, Seance, SeanceId } from './types'

const GROS = 120
const ISOLATION = 90

export const SEANCES: Readonly<Record<SeanceId, Seance>> = {
  A: {
    id: 'A',
    titre: 'Pecs, dos, jambes légères',
    jour: 1,
    duree: '~1h15',
    exercices: [
      { exerciceId: 'chest-press', series: 3, reps: [8, 12], reposSec: GROS },
      { exerciceId: 'tirage-vertical-neutre', series: 3, reps: [10, 12], reposSec: GROS },
      { exerciceId: 'presse-cuisses', series: 3, reps: [10, 12], reposSec: GROS },
      { exerciceId: 'rowing-assis-machine', series: 3, reps: [10, 12], reposSec: GROS },
      { exerciceId: 'elevations-laterales-halteres', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'curl-biceps-poulie', series: 3, reps: [10, 12], reposSec: ISOLATION },
      { exerciceId: 'extension-triceps-corde', series: 3, reps: [10, 12], reposSec: ISOLATION },
    ],
  },
  B: {
    id: 'B',
    titre: 'Dos, épaules, ischios',
    jour: 3,
    duree: '~1h20',
    exercices: [
      { exerciceId: 'tractions-assistees', series: 3, reps: [6, 10], reposSec: GROS },
      { exerciceId: 'shoulder-press-machine', series: 3, reps: [8, 12], reposSec: GROS },
      { exerciceId: 'developpe-incline-smith', series: 3, reps: [8, 12], reposSec: GROS },
      { exerciceId: 'leg-curl-assis', series: 3, reps: [10, 12], reposSec: ISOLATION },
      { exerciceId: 'pec-deck', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'face-pull', series: 3, reps: [15, 15], reposSec: ISOLATION },
      { exerciceId: 'curl-marteau', series: 3, reps: [10, 12], reposSec: ISOLATION },
      { exerciceId: 'crunch-machine', series: 3, reps: [12, 15], reposSec: ISOLATION },
    ],
  },
  C: {
    id: 'C',
    titre: 'Jambes, haut du corps en complément',
    jour: 5,
    duree: '~1h20',
    exercices: [
      { exerciceId: 'hack-squat', series: 4, reps: [8, 12], reposSec: GROS },
      { exerciceId: 'leg-extension', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'leg-curl-allonge', series: 3, reps: [10, 12], reposSec: ISOLATION },
      { exerciceId: 'extension-lombaire-45', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'mollets-machine', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'chest-press', series: 3, reps: [10, 12], reposSec: GROS },
      { exerciceId: 'rowing-machine-neutre', series: 3, reps: [10, 12], reposSec: GROS },
      { exerciceId: 'elevations-laterales-poulie', series: 3, reps: [12, 15], reposSec: ISOLATION },
      { exerciceId: 'releves-jambes-chaise-romaine', series: 3, reps: [10, 15], reposSec: ISOLATION },
    ],
  },
}

/** Planning type, index 1 = lundi … 7 = dimanche. */
export const PLANNING: Readonly<Record<number, Activite>> = {
  1: 'muscu',
  2: 'tennis',
  3: 'muscu',
  4: 'tennis',
  5: 'muscu',
  6: 'repos',
  7: 'padel',
}

/** Séance associée à chaque jour de muscu. */
export const SEANCE_PAR_JOUR: Readonly<Record<number, SeanceId>> = { 1: 'A', 3: 'B', 5: 'C' }

/** Les 3 exercices phares du contrôle segmenté de l'écran Progression. */
export const EXERCICES_PHARES = ['chest-press', 'tirage-vertical-neutre', 'presse-cuisses'] as const
