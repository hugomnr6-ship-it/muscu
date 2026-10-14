import { describe, expect, it } from 'vitest'
import { ajouterTemps, pourcentage, restant } from './minuteur'

const NOW = 1_800_000_000_000

describe('minuteur', () => {
  it('calcule le temps restant à partir du timestamp de fin', () => {
    expect(restant(null, NOW)).toBe(0)
    expect(restant(NOW + 84_000, NOW)).toBe(84)
    expect(restant(NOW + 83_500, NOW)).toBe(84)
    expect(restant(NOW - 1, NOW)).toBe(0)
  })

  it('ajoute du temps au repos en cours ou en relance un', () => {
    expect(ajouterTemps(NOW + 10_000, NOW, 30)).toBe(NOW + 40_000)
    expect(ajouterTemps(NOW - 5_000, NOW, 30)).toBe(NOW + 30_000)
    expect(ajouterTemps(null, NOW, 30)).toBe(NOW + 30_000)
  })

  it('donne le pourcentage restant borné entre 0 et 100', () => {
    expect(pourcentage(84, 120)).toBe(70)
    expect(pourcentage(200, 120)).toBe(100)
    expect(pourcentage(10, 0)).toBe(0)
  })
})
