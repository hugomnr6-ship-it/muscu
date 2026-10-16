/** Comment la charge se lit : poids soulevé, aide de la machine (moins = mieux) ou poids du corps. */
export type TypeCharge = 'charge' | 'assistance' | 'poidsDuCorps'

export type SeanceId = 'A' | 'B' | 'C'

export type Activite = 'muscu' | 'tennis' | 'padel' | 'repos'

export interface VideoExercice {
  youtubeId: string
  titre: string
  chaine: string
}

/** Démo courte du mouvement, lue en boucle et sans le son. */
export interface DemoExercice {
  youtubeId: string
  /** Durée de la vidéo (ou de l'extrait) en secondes. */
  duree: number
  vertical: boolean
  /** Extrait d'une vidéo plus longue (secondes). */
  debut?: number
  fin?: number
}

/** Pour trouver la machine à la salle : ce qui est écrit dessus et à quoi elle ressemble. */
export interface MachineSalle {
  nom: string
  aspect: string
}

export interface Exercice {
  id: string
  nom: string
  /** Libellé court pour les graphiques et le contrôle segmenté. */
  court: string
  typeCharge: TypeCharge
  /** Incrément du stepper kg et de la suggestion de charge. */
  pasKg: number
  technique: string[]
  /** Renseigné pour les exercices du programme ; absent des anciens, gardés pour l'historique. */
  machine?: MachineSalle
  /** Que faire si la machine est prise trop longtemps ou introuvable. */
  planB?: string
  /** Tuto complet (avec explications), ouvert depuis les points de technique. */
  video?: VideoExercice
  demo?: DemoExercice
  /** Recherche YouTube de secours quand aucune vidéo n'a été vérifiée. */
  rechercheVideo: string
}

export interface ExerciceSeance {
  exerciceId: string
  series: number
  reps: readonly [number, number]
  reposSec: number
}

export interface Seance {
  id: SeanceId
  titre: string
  /** 1 = lundi … 7 = dimanche */
  jour: number
  duree: string
  exercices: readonly ExerciceSeance[]
}

export interface SerieFaite {
  kg: number
  reps: number
}

export interface ExerciceFait {
  exerciceId: string
  series: SerieFaite[]
}

export interface SeanceFaite {
  id: string
  seanceId: SeanceId
  /** Date locale YYYY-MM-DD */
  date: string
  debut: number
  fin: number
  decouverte: boolean
  exercices: ExerciceFait[]
}

export interface Pesee {
  date: string
  poids: number
  taille: number
}

export interface SerieEnCours {
  kg: number
  reps: number
  faite: boolean
}

export interface ExerciceEnCours {
  exerciceId: string
  reps: readonly [number, number]
  reposSec: number
  series: SerieEnCours[]
}

export interface SeanceEnCours {
  id: string
  seanceId: SeanceId
  date: string
  debut: number
  decouverte: boolean
  allegee: boolean
  index: number
  exercices: ExerciceEnCours[]
  /** Dernière série validée : borne la durée d'une séance oubliée ouverte. */
  derniereAction: number
  /** Timestamp de fin du repos : le minuteur reste juste même si l'appli passe en arrière-plan. */
  reposFinA: number | null
  reposDuree: number
}

export type SportRaquette = 'tennis' | 'padel'

export interface Donnees {
  version: 1
  historique: SeanceFaite[]
  pesees: Pesee[]
  /** Tennis / padel faits, par date YYYY-MM-DD */
  activites: Record<string, SportRaquette>
  seanceEnCours: SeanceEnCours | null
}
