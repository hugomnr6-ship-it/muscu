import { describe, expect, it } from 'vitest'
import { SEANCES } from '../data/programme'
import { apercuSeance } from './apercu'
import { s, seanceFaite } from './fixtures'

describe('apercuSeance', () => {
  it('liste les exercices avec séries, reps et repos prévus', () => {
    const apercu = apercuSeance(SEANCES.A, [], { decouverte: false, allegee: false })
    expect(apercu).toHaveLength(7)
    expect(apercu[0]).toEqual({
      exerciceId: 'chest-press',
      series: 3,
      reps: [8, 12],
      reposSec: 120,
      derniere: null,
      suggestion: { kg: null, delta: 0, raison: 'premiere' },
    })
  })

  it('applique la séance découverte et la semaine légère', () => {
    expect(apercuSeance(SEANCES.C, [], { decouverte: true, allegee: false }).map((e) => e.series)).toEqual(
      Array(9).fill(2),
    )
    expect(apercuSeance(SEANCES.C, [], { decouverte: false, allegee: true })[0].series).toBe(3)
  })

  it('reprend la dernière perf et la charge à essayer', () => {
    const historique = [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(30, 12), s(30, 12)] })]
    const [premier] = apercuSeance(SEANCES.A, historique, { decouverte: false, allegee: false })
    expect(premier.derniere).toEqual({ date: '2026-10-19', series: [s(30, 12), s(30, 12), s(30, 12)] })
    expect(premier.suggestion).toEqual({ kg: 32.5, delta: 2.5, raison: 'augmente' })
  })
})
