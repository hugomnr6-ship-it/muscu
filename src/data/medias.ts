import type { DemoExercice, VideoExercice } from './types'

interface MediaExercice {
  video?: VideoExercice
  demo?: DemoExercice
}

/**
 * Par exercice : une démo courte (lue en boucle, sans le son) et le tuto complet en français.
 * Toutes les vidéos sont vérifiées (oEmbed 200 = intégration autorisée).
 */
export const MEDIAS: Readonly<Record<string, MediaExercice>> = {
  'chest-press': {
    demo: { youtubeId: 'NwzUje3z0qY', duree: 11, vertical: false },
    video: {
      youtubeId: 'r8CG2MjEwmc',
      titre: 'Comment bien utiliser la Chest Press convergente | Réglages + Exécution | Machine Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'tirage-vertical-neutre': {
    demo: { youtubeId: '--utaPT7XYQ', duree: 13, vertical: false },
    video: {
      youtubeId: 'LCSHY719Kv8',
      titre: 'Tirage Vertical Prise NEUTRE - Le Bon Geste',
      chaine: 'La Boite à Outils Du Coach Sportif',
    },
  },
  'presse-cuisses': {
    demo: { youtubeId: 'yZmx_Ac3880', duree: 11, vertical: false },
    video: {
      youtubeId: '-4WH5PWaJtA',
      titre: 'PRESSE INCLINÉE À 45 DEGRÉS - TECHNIQUE',
      chaine: 'Jon Healthyman',
    },
  },
  'rowing-assis-machine': {
    demo: { youtubeId: 'UCXxvVItLoM', duree: 17, vertical: false },
    video: {
      youtubeId: 'Wze5LRG4ZoA',
      titre: 'Comment utiliser la machine TIRAGE HORIZONTAL | Dos épais & puissant | Machine Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'elevations-laterales-halteres': {
    demo: { youtubeId: 'OuG1smZTsQQ', duree: 11, vertical: false },
    video: {
      youtubeId: 'q_DYeb_daeY',
      titre: 'Élévations Latérales : Technique et astuces (musculation des épaules avec haltères)',
      chaine: "Olymp'Fit",
    },
  },
  'curl-biceps-poulie': {
    demo: { youtubeId: 'opFVuRi_3b8', duree: 14, vertical: false },
    video: {
      youtubeId: 'SoPOSlAonxY',
      titre: 'CURL BICEPS POULIE BASSE : TECHNIQUE D’EXECUTION PARFAITE🔥💪🏼',
      chaine: 'Gabriel Augusto',
    },
  },
  'extension-triceps-corde': {
    demo: { youtubeId: '-xa-6cQaZKY', duree: 12, vertical: false },
    video: {
      youtubeId: 'ADRve8qqC1U',
      titre: 'EXTENSION TRICEPS À LA CORDE : Fais-le CORRECTEMENT ! (Tuto complet)',
      chaine: 'Bodykev Coaching',
    },
  },
  'tractions-assistees': {
    demo: { youtubeId: '8ygapPMYK1I', duree: 11, vertical: false },
    video: {
      youtubeId: 'TBWaf6AJdkg',
      titre: 'Comment utiliser le GRAVITRON pour progresser en Tractions & Dips | Machine Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'shoulder-press-machine': {
    demo: { youtubeId: 'WvLMauqrnK8', duree: 13, vertical: false },
    video: {
      youtubeId: 'qrCPnVYJEo0',
      titre: 'Comment bien utiliser la Shoulder Press Convergente | Spécial Épaules | Machine Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'developpe-incline-smith': {
    demo: { youtubeId: '8urE8Z8AMQ4', duree: 13, vertical: false },
    video: {
      youtubeId: 'kyf5WkG7jtw',
      titre: 'Développe ton haut de pecs avec du développé incliné à la smith machine !',
      chaine: 'Maxime Clergeau - Coach transformations physiques',
    },
  },
  'leg-curl-assis': {
    demo: { youtubeId: 'Orxowest56U', duree: 11, vertical: false },
    video: {
      youtubeId: 'ku8CpHoHe6E',
      titre: 'Comment utiliser le LEG CURL ASSIS Matrix de chez Basic-Fit ?',
      chaine: 'Bodykev Coaching',
    },
  },
  'pec-deck': {
    demo: { youtubeId: 'O-OBCfyh9Fw', duree: 12, vertical: false },
    video: {
      youtubeId: 'jRQ0cKGdNMs',
      titre: 'Comment utiliser le PEC-DECK pour les PECTORAUX OU les ÉPAULES ? | Réglages + Exécution | Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'face-pull': {
    demo: { youtubeId: '-MODnZdnmAQ', duree: 11, vertical: false },
    video: {
      youtubeId: '4FAiPDzKRUw',
      titre: '[TUTO] Face Pulls',
      chaine: 'BeComplete',
    },
  },
  'curl-marteau': {
    demo: { youtubeId: 'XOEL4MgekYE', duree: 13, vertical: false },
    video: {
      youtubeId: '2CqCpby14HI',
      titre: 'Le Curl Prise Marteau : L’exercice pour des gros bras!',
      chaine: 'FRANCK ROPERS',
    },
  },
  'crunch-machine': {
    demo: { youtubeId: '-OUSBPnHvsQ', duree: 9, vertical: false },
    video: {
      youtubeId: 'F923R6AqYjo',
      titre: 'ABDOMINAL CRUNCH : Bien utiliser la machine Basic-Fit 💪',
      chaine: 'BmD | Train With Me',
    },
  },
  'hack-squat': {
    demo: { youtubeId: 'rYgNArpwE7E', duree: 14, vertical: false },
    video: {
      youtubeId: '4-626tBdAfg',
      titre: 'Comment utiliser le HACK SQUAT Matrix de chez Basic-fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'leg-extension': {
    demo: { youtubeId: 'm0FOpMEgero', duree: 11, vertical: false },
    video: {
      youtubeId: 'FzKZ1xe4cQw',
      titre: 'Comment utiliser le LEG EXTENSION Matrix de chez Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'leg-curl-allonge': {
    demo: { youtubeId: 'n5WDXD_mpVY', duree: 13, vertical: false },
    video: {
      youtubeId: 'RGVl-EhqFN8',
      titre: 'Comment utiliser le LEG CURL ALLONGÉ Matrix de chez Basic-Fit ?',
      chaine: 'Bodykev Coaching',
    },
  },
  'extension-lombaire-45': {
    demo: { youtubeId: '5_ejbGfdAQE', duree: 12, vertical: false },
    video: {
      youtubeId: 'xTKJKb71m0k',
      titre: 'Comment Utiliser le Banc à Lombaires : Renforce Tes Lombaires & Fessiers en Même Temps !',
      chaine: 'BmD | Train With Me',
    },
  },
  'mollets-machine': {
    demo: { youtubeId: '95itLfMBG40', duree: 7, vertical: true },
    video: {
      youtubeId: 'BeWXXo5jVMM',
      titre: 'Mollet sur Machine BMD coaching',
      chaine: 'BmD | Train With Me',
    },
  },
  'rowing-machine-neutre': {
    demo: { youtubeId: '_FrrYQxA6kc', duree: 14, vertical: false },
    video: {
      youtubeId: 'xkaX66b1oA0',
      titre: 'Comment bien utiliser le ROWING à 2 prises | Réglages + Exécution | Machine Basic-Fit',
      chaine: 'Bodykev Coaching',
    },
  },
  'elevations-laterales-poulie': {
    demo: { youtubeId: 'Z5FA9aq3L6A', duree: 15, vertical: false },
    video: {
      youtubeId: 'g6D4P3uf40M',
      titre: 'Comment Bien Faire Tes Elévations Latérales A La Poulie',
      chaine: 'Big K Coach',
    },
  },
  'releves-jambes-chaise-romaine': {
    demo: { youtubeId: 'KBinYfCSs6s', duree: 12, vertical: true },
    video: {
      youtubeId: 'xivCwuJfQqo',
      titre: 'Relevé de jambes à la chaise romaine',
      chaine: 'ludozaa personal trainer',
    },
  },
}
