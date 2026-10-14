import { describe, expect, it } from 'vitest'
import type { Pesee } from '../data/types'
import { doitRappelerPesee, enregistrerPesee, estJourDePesee, estJourPhotos, peseeDeLaSemaine, tendance } from './pesee'

const pesees: Pesee[] = [
  { date: '2026-10-16', poids: 70, taille: 80 },
  { date: '2026-10-23', poids: 70.3, taille: 80 },
]

describe('pesée', () => {
  it('a lieu le vendredi', () => {
    expect(estJourDePesee('2026-10-16')).toBe(true)
    expect(estJourDePesee('2026-10-17')).toBe(false)
  })

  it('retrouve la pesée de la semaine en cours', () => {
    expect(peseeDeLaSemaine(pesees, '2026-10-25')).toEqual(pesees[1])
    expect(peseeDeLaSemaine(pesees, '2026-10-26')).toBeNull()
  })

  it("rappelle la pesée le vendredi si elle n'est pas faite", () => {
    expect(doitRappelerPesee(pesees, '2026-10-30')).toBe(true)
    expect(doitRappelerPesee(pesees, '2026-10-23')).toBe(false)
    expect(doitRappelerPesee(pesees, '2026-10-29')).toBe(false)
  })

  it("remplace la pesée de la même semaine sans modifier la liste d'origine", () => {
    const resultat = enregistrerPesee(pesees, { date: '2026-10-24', poids: 70.5, taille: 80.5 })
    expect(resultat).toEqual([pesees[0], { date: '2026-10-24', poids: 70.5, taille: 80.5 }])
    expect(pesees).toHaveLength(2)
    expect(pesees[1].poids).toBe(70.3)
  })

  it("ajoute et trie une pesée d'une nouvelle semaine", () => {
    const resultat = enregistrerPesee([pesees[1]], { date: '2026-10-16', poids: 70, taille: 80 })
    expect(resultat.map((p) => p.date)).toEqual(['2026-10-16', '2026-10-23'])
  })

  it('calcule la tendance des 3 dernières pesées', () => {
    const liste = [
      ...pesees,
      { date: '2026-10-30', poids: 70.6, taille: 80.5 },
      { date: '2026-11-06', poids: 70.8, taille: 80.5 },
    ]
    expect(tendance(liste, 'poids')).toEqual({ derniere: 70.8, delta: 0.2, dernieres: [70.3, 70.6, 70.8] })
    expect(tendance([pesees[0]], 'taille')).toEqual({ derniere: 80, delta: null, dernieres: [80] })
    expect(tendance([], 'poids')).toBeNull()
  })

  it('rappelle les photos au départ, en semaine 6 et en semaine 12', () => {
    expect(estJourPhotos('2026-10-16')).toBe(true)
    expect(estJourPhotos('2026-11-27')).toBe(true)
    expect(estJourPhotos('2027-01-08')).toBe(true)
    expect(estJourPhotos('2026-11-20')).toBe(false)
  })
})
