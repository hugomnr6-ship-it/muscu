import { describe, expect, it } from 'vitest'
import { EXERCICES } from './catalogue'
import { EXERCICES_PHARES, SEANCES } from './programme'

const idsDuProgramme = [...new Set(Object.values(SEANCES).flatMap((s) => s.exercices.map((e) => e.exerciceId)))]

describe('programme', () => {
  it('ne contient que des exercices du catalogue', () => {
    for (const id of [...idsDuProgramme, ...EXERCICES_PHARES]) {
      expect(EXERCICES.has(id), id).toBe(true)
    }
  })

  it('dit pour chaque exercice quelle machine chercher et quoi faire si elle est introuvable', () => {
    for (const id of idsDuProgramme) {
      const exercice = EXERCICES.get(id)
      expect(exercice?.machine?.nom, id).toBeTruthy()
      expect(exercice?.machine?.aspect, id).toBeTruthy()
      expect(exercice?.planB, id).toBeTruthy()
    }
  })

  it('montre une démo courte pour chaque exercice', () => {
    for (const id of idsDuProgramme) {
      expect(EXERCICES.get(id)?.demo, id).toBeDefined()
    }
  })

  it('garde les exercices déjà enregistrés pour relire l’historique', () => {
    for (const ancien of ['hack-squat', 'extension-lombaire-45', 'mollets-machine', 'elevations-laterales-poulie', 'leg-curl-allonge']) {
      expect(EXERCICES.has(ancien), ancien).toBe(true)
    }
  })
})
