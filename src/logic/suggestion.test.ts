import { describe, expect, it } from 'vitest'
import { s, seanceFaite } from './fixtures'
import { derniereFois, suggererCharge } from './suggestion'

describe('suggererCharge', () => {
  it('ne propose rien la première fois', () => {
    expect(suggererCharge(null, [8, 12], 'charge', 2.5)).toEqual({ kg: null, delta: 0, raison: 'premiere' })
  })

  it('ajoute un cran quand toutes les séries atteignent le haut de la fourchette', () => {
    expect(suggererCharge([s(40, 12), s(40, 12), s(40, 12)], [8, 12], 'charge', 2.5)).toEqual({
      kg: 42.5,
      delta: 2.5,
      raison: 'augmente',
    })
  })

  it('part de la charge la plus lourde quand les charges varient', () => {
    expect(suggererCharge([s(40, 12), s(42.5, 12)], [8, 12], 'charge', 2.5).kg).toBe(45)
  })

  it('garde la même charge sinon', () => {
    expect(suggererCharge([s(40, 12), s(40, 12), s(40, 11)], [8, 12], 'charge', 2.5)).toEqual({
      kg: 40,
      delta: 0,
      raison: 'garde',
    })
    expect(suggererCharge([s(40, 12), s(42.5, 9)], [8, 12], 'charge', 2.5).kg).toBe(42.5)
  })

  it("réduit l'aide de la machine pour les tractions assistées", () => {
    expect(suggererCharge([s(30, 10), s(30, 10), s(30, 10)], [6, 10], 'assistance', 2.5)).toEqual({
      kg: 27.5,
      delta: -2.5,
      raison: 'augmente',
    })
    expect(suggererCharge([s(30, 10), s(30, 7)], [6, 10], 'assistance', 2.5).kg).toBe(30)
  })

  it("ne descend jamais l'aide sous 0", () => {
    expect(suggererCharge([s(0, 10), s(0, 10)], [6, 10], 'assistance', 2.5)).toEqual({
      kg: 0,
      delta: 0,
      raison: 'plusDeReps',
    })
  })

  it('propose plus de répétitions au poids du corps', () => {
    expect(suggererCharge([s(0, 15), s(0, 15)], [10, 15], 'poidsDuCorps', 2.5)).toEqual({
      kg: 0,
      delta: 0,
      raison: 'plusDeReps',
    })
  })

  it('juge sur la charge utilisée pour la majorité des séries', () => {
    expect(suggererCharge([s(20, 12), s(20, 12), s(25, 5)], [8, 12], 'charge', 2.5)).toEqual({
      kg: 22.5,
      delta: 2.5,
      raison: 'augmente',
    })
    expect(suggererCharge([s(20, 12), s(20, 10), s(25, 5)], [8, 12], 'charge', 2.5).kg).toBe(20)
  })

  it('arrondit les charges à 2 décimales', () => {
    expect(suggererCharge([s(1.25, 15), s(1.25, 15)], [12, 15], 'charge', 1.25).kg).toBe(2.5)
  })
})

describe('derniereFois', () => {
  const historique = [
    seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(30, 10)] }),
    seanceFaite('2026-10-23', { 'chest-press': [s(32.5, 11)], 'hack-squat': [s(40, 10)] }, 'C'),
    seanceFaite('2026-10-26', { 'chest-press': [], 'tirage-vertical-neutre': [s(35, 12)] }),
  ]

  it('renvoie les séries de la séance la plus récente de cet exercice', () => {
    expect(derniereFois(historique, 'chest-press')).toEqual({ date: '2026-10-23', series: [s(32.5, 11)] })
  })

  it('renvoie null pour un exercice jamais fait', () => {
    expect(derniereFois(historique, 'pec-deck')).toBeNull()
  })
})
