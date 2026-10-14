import { describe, expect, it } from 'vitest'
import { s, seanceFaite } from './fixtures'
import { calculerRecords, nouveauxRecords, premieresFois } from './records'

const historique = [
  seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(32.5, 8)], 'tractions-assistees': [s(30, 8)] }),
  seanceFaite('2026-10-21', { 'chest-press': [s(32.5, 10)], 'tractions-assistees': [s(27.5, 6)] }),
]

describe('calculerRecords', () => {
  it('garde la charge la plus lourde, puis le plus de reps à charge égale', () => {
    expect(calculerRecords(historique).get('chest-press')).toEqual({ kg: 32.5, reps: 10, date: '2026-10-21' })
  })

  it("garde l'aide la plus faible pour les tractions assistées", () => {
    expect(calculerRecords(historique).get('tractions-assistees')).toEqual({ kg: 27.5, reps: 6, date: '2026-10-21' })
  })

  it('ignore les séries à 0 répétition', () => {
    const records = calculerRecords([seanceFaite('2026-10-19', { 'chest-press': [s(50, 0), s(30, 10)] })])
    expect(records.get('chest-press')?.kg).toBe(30)
  })

  it('compare le poids du corps sur les répétitions', () => {
    const records = calculerRecords([
      seanceFaite('2026-10-19', { 'releves-jambes-chaise-romaine': [s(0, 12), s(0, 14)] }),
    ])
    expect(records.get('releves-jambes-chaise-romaine')).toEqual({ kg: 0, reps: 14, date: '2026-10-19' })
  })
})

describe('nouveauxRecords / premieresFois', () => {
  const seance = seanceFaite('2026-10-26', {
    'chest-press': [s(35, 9)],
    'tractions-assistees': [s(30, 10)],
    'pec-deck': [s(20, 15)],
  })

  it("liste les records battus par rapport à l'historique", () => {
    expect(nouveauxRecords(historique, seance)).toEqual(['chest-press'])
  })

  it('liste les exercices faits pour la première fois', () => {
    expect(premieresFois(historique, seance)).toEqual(['pec-deck'])
  })
})
