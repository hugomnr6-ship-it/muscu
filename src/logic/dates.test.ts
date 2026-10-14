import { describe, expect, it } from 'vitest'
import { ajouterJours, ecartJours, enISO, jourSemaine, lundiDeLaSemaine } from './dates'

describe('dates', () => {
  it('formate une date locale en YYYY-MM-DD', () => {
    expect(enISO(new Date(2026, 9, 16, 23, 30))).toBe('2026-10-16')
    expect(enISO(new Date(2027, 0, 4))).toBe('2027-01-04')
  })

  it('donne le jour de la semaine avec lundi = 1 et dimanche = 7', () => {
    expect(jourSemaine('2026-10-16')).toBe(5)
    expect(jourSemaine('2026-10-18')).toBe(7)
    expect(jourSemaine('2026-10-19')).toBe(1)
  })

  it('ajoute des jours, y compris au passage à l’heure d’hiver', () => {
    expect(ajouterJours('2026-10-30', 3)).toBe('2026-11-02')
    expect(ajouterJours('2026-10-24', 2)).toBe('2026-10-26')
    expect(ajouterJours('2026-10-19', -3)).toBe('2026-10-16')
  })

  it('calcule l’écart en jours entre deux dates', () => {
    expect(ecartJours('2026-10-19', '2026-10-26')).toBe(7)
    expect(ecartJours('2026-10-19', '2026-10-16')).toBe(-3)
    expect(ecartJours('2026-10-24', '2026-10-26')).toBe(2)
  })

  it('trouve le lundi de la semaine', () => {
    expect(lundiDeLaSemaine('2026-10-18')).toBe('2026-10-12')
    expect(lundiDeLaSemaine('2026-10-19')).toBe('2026-10-19')
    expect(lundiDeLaSemaine('2026-10-16')).toBe('2026-10-12')
  })
})
