import { describe, expect, it } from 'vitest'
import { libelleJour, nomDuJour, pluriel } from './libelles'

describe('libellés', () => {
  it('nomme le jour de la semaine', () => {
    expect(nomDuJour('2026-10-21')).toBe('mercredi')
  })

  it('accorde au pluriel', () => {
    expect(pluriel(1, 'exercice')).toBe('1 exercice')
    expect(pluriel(7, 'exercice')).toBe('7 exercices')
  })

  it('écrit aujourd’hui, demain, puis la date courte', () => {
    expect(libelleJour('2026-10-14', '2026-10-14')).toBe('Aujourd’hui')
    expect(libelleJour('2026-10-15', '2026-10-14')).toBe('Demain')
    expect(libelleJour('2026-10-16', '2026-10-14')).toBe('Ven. 16 oct.')
    expect(libelleJour('2026-11-01', '2026-10-31')).toBe('Demain')
  })
})
