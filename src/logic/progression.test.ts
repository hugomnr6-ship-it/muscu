import { describe, expect, it } from 'vitest'
import { s, seanceFaite } from './fixtures'
import { geometrieCourbe, pointsProgression } from './progression'

describe('pointsProgression', () => {
  const historique = [
    seanceFaite('2026-10-21', { 'chest-press': [s(32.5, 10), s(35, 8)] }),
    seanceFaite('2026-10-19', { 'chest-press': [s(30, 12)], 'tractions-assistees': [s(30, 8), s(27.5, 6)] }),
    seanceFaite('2026-10-23', { 'tractions-assistees': [s(25, 6)] }),
  ]

  it('donne la meilleure charge de chaque séance, dans l’ordre chronologique', () => {
    expect(pointsProgression(historique, 'chest-press', 'charge')).toEqual([
      { date: '2026-10-19', kg: 30, semaine: 1 },
      { date: '2026-10-21', kg: 35, semaine: 1 },
    ])
  })

  it("prend l'aide la plus faible pour les tractions assistées", () => {
    expect(pointsProgression(historique, 'tractions-assistees', 'assistance').map((p) => p.kg)).toEqual([27.5, 25])
  })

  it('limite aux dernières séances', () => {
    const beaucoup = Array.from({ length: 12 }, (_, i) =>
      seanceFaite(`2026-11-${String(i + 1).padStart(2, '0')}`, { 'chest-press': [s(30 + i, 10)] }),
    )
    const points = pointsProgression(beaucoup, 'chest-press', 'charge', 8)
    expect(points).toHaveLength(8)
    expect(points[7].kg).toBe(41)
  })
})

describe('geometrieCourbe', () => {
  it('renvoie null sans valeur', () => {
    expect(geometrieCourbe([])).toBeNull()
  })

  it('trace une ligne et repère le dernier point en pourcentage', () => {
    const geo = geometrieCourbe([32.5, 35, 37.5, 37.5, 40, 42.5])
    expect(geo?.ligne.split(' ')).toHaveLength(6)
    expect(geo?.ligne.startsWith('8.0,')).toBe(true)
    expect(geo?.aire.startsWith('M8,130 L8.0,')).toBe(true)
    expect(geo?.dernier.l).toBeCloseTo(97.5, 1)
    expect(geo?.dernier.t).toBeLessThan(50)
  })

  it('centre une courbe plate ou à un seul point', () => {
    const geo = geometrieCourbe([40])
    expect(geo?.dernier.t).toBeCloseTo(50, 0)
    expect(geo?.ligne.split(' ')).toHaveLength(2)
  })
})
