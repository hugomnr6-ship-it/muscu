export type IconeConseil = 'nutrition' | 'proteines' | 'montre' | 'epaule' | 'plaisir' | 'raquette' | 'suite'

export interface Conseil {
  id: string
  icone: IconeConseil
  titre: string
  points: readonly string[]
}

/** Conseils repris de nos échanges (phase 1, prise de muscle sans prendre de ventre). */
export const CONSEILS: readonly Conseil[] = [
  {
    id: 'nutrition',
    icone: 'nutrition',
    titre: 'Prise de muscle propre',
    points: [
      'Vise +250 g par semaine en moyenne, pas plus.',
      'Si le tour de taille monte de plus de 1 cm par mois, passe à +150 g par semaine.',
      'Si la balance ne bouge plus pendant 2 semaines, ajoute 150 à 200 kcal par jour.',
    ],
  },
  {
    id: 'proteines',
    icone: 'proteines',
    titre: 'Protéines, lipides, glucides',
    points: [
      'Protéines : 1,6 à 2 g par kg par jour, une portion grande comme ta main à chaque repas.',
      'Lipides : environ 1 g par kg. 1 g de lipides = 9 kcal, ça monte vite.',
      'Le reste en glucides (riz, pâtes, pain, fruits) : c’est le carburant du tennis et de la muscu.',
      'Dors 7 à 9 h : c’est là que le muscle se construit.',
    ],
  },
  {
    id: 'montre',
    icone: 'montre',
    titre: 'Yazio et Apple Watch',
    points: [
      'La montre surestime souvent les calories du sport.',
      'Dans Yazio, compte la moitié des calories du tennis et du padel, ou aucune.',
      'C’est la pesée du vendredi qui tranche, pas l’estimation de la montre.',
    ],
  },
  {
    id: 'epaule',
    icone: 'epaule',
    titre: 'Ton épaule droite',
    points: [
      'Tirage vertical : prise neutre, à la poitrine, jamais derrière la nuque.',
      'Charges légères les 2 premières semaines sur le tirage et le développé épaules.',
      'Le face pull du mercredi protège tes épaules : ne le saute pas.',
      'Une douleur vive = tu arrêtes l’exercice et tu baisses la charge la fois suivante.',
    ],
  },
  {
    id: 'plaisir',
    icone: 'plaisir',
    titre: 'Repas plaisir',
    points: [
      'Un repas plaisir par semaine, noté dans Yazio : aucun souci.',
      'Un repas, pas une journée. Mange jusqu’à être rassasié, pas jusqu’à ne plus bouger.',
      'Les gros craquages hors suivi : 1 à 2 fois par mois maximum.',
      'Le lundi, la balance monte à cause de l’eau et du sel : pas de panique.',
    ],
  },
  {
    id: 'raquette',
    icone: 'raquette',
    titre: 'Tennis et padel',
    points: [
      'C’est ton cardio : ça aide à rester sec sans freiner la prise de muscle.',
      'Les jambes lourdes sont le vendredi, pour avoir 48 h avant le padel.',
      'Une semaine sans tennis ? Tu progresses quand même avec les 3 séances.',
    ],
  },
  {
    id: 'suite',
    icone: 'suite',
    titre: 'Après les 12 semaines',
    points: [
      'Bilan complet : photos, poids, tour de taille, records.',
      'Phase 2 : arrivée des exercices à la barre (squat, développé couché, soulevé de terre roumain).',
      'Passage possible à 4 séances par semaine si tu récupères bien.',
    ],
  },
]
