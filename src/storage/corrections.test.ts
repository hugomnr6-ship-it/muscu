import { describe, expect, it } from 'vitest'
import type { Donnees } from '../data/types'
import { seanceFaite, s } from '../logic/fixtures'
import { appliquerCorrections } from './corrections'
import { donneesVides } from './repository'

const correction = { date: '2026-10-21', de: 'oiseau-machine', vers: 'pec-deck' }

const avec = (...historique: Donnees['historique']): Donnees => ({ ...donneesVides(), historique })

describe('appliquerCorrections', () => {
  it('range les séries sous le bon exercice le jour concerné', () => {
    const donnees = avec(
      seanceFaite('2026-10-21', { 'tractions-assistees': [s(30, 8)], 'oiseau-machine': [s(25, 12), s(25, 10)] }, 'B'),
    )

    const corrigees = appliquerCorrections(donnees, [correction])

    expect(corrigees.historique[0].exercices).toEqual([
      { exerciceId: 'tractions-assistees', series: [s(30, 8)] },
      { exerciceId: 'pec-deck', series: [s(25, 12), s(25, 10)] },
    ])
  })

  it('remplace un pec deck resté vide', () => {
    const donnees = avec(seanceFaite('2026-10-21', { 'pec-deck': [], 'oiseau-machine': [s(25, 12)] }, 'B'))

    const corrigees = appliquerCorrections(donnees, [correction])

    expect(corrigees.historique[0].exercices).toEqual([{ exerciceId: 'pec-deck', series: [s(25, 12)] }])
  })

  it('ne touche à rien si le pec deck a déjà des séries', () => {
    const donnees = avec(seanceFaite('2026-10-21', { 'pec-deck': [s(30, 12)], 'oiseau-machine': [s(15, 12)] }, 'B'))

    expect(appliquerCorrections(donnees, [correction])).toBe(donnees)
  })

  it('ne touche ni aux autres jours ni à des données déjà corrigées', () => {
    const autreJour = avec(seanceFaite('2026-10-28', { 'oiseau-machine': [s(15, 12)] }, 'B'))
    const dejaCorrigees = appliquerCorrections(
      avec(seanceFaite('2026-10-21', { 'oiseau-machine': [s(25, 12)] }, 'B')),
      [correction],
    )

    expect(appliquerCorrections(autreJour, [correction])).toBe(autreJour)
    expect(appliquerCorrections(dejaCorrigees, [correction])).toBe(dejaCorrigees)
  })
})
