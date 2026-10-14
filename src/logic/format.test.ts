import { describe, expect, it } from 'vitest'
import { chargeFr, dateLongue, dureeFr, minuteurFr, nombreFr, reposFr, repsFr } from './format'

describe('format', () => {
  it('écrit les nombres avec une virgule et sans zéros inutiles', () => {
    expect(nombreFr(42.5)).toBe('42,5')
    expect(nombreFr(40)).toBe('40')
    expect(nombreFr(1.25)).toBe('1,25')
    expect(nombreFr(77.6000001)).toBe('77,6')
  })

  it('écrit une charge selon son type', () => {
    expect(chargeFr(42.5, 'charge')).toBe('42,5 kg')
    expect(chargeFr(0, 'poidsDuCorps')).toBe('PDC')
    expect(chargeFr(10, 'poidsDuCorps')).toBe('+10 kg')
    expect(chargeFr(30, 'assistance')).toBe('30 kg d’aide')
  })

  it('écrit la date longue en français avec une majuscule', () => {
    expect(dateLongue('2026-10-16')).toBe('Vendredi 16 octobre')
    expect(dateLongue('2026-11-01')).toBe('Dimanche 1 novembre')
  })

  it('écrit une durée de séance', () => {
    expect(dureeFr(72 * 60_000)).toBe('1h12')
    expect(dureeFr(60 * 60_000)).toBe('1h00')
    expect(dureeFr(48 * 60_000)).toBe('48 min')
    expect(dureeFr(20_000)).toBe('1 min')
  })

  it('écrit le minuteur en m:ss', () => {
    expect(minuteurFr(84)).toBe('1:24')
    expect(minuteurFr(5)).toBe('0:05')
    expect(minuteurFr(0)).toBe('0:00')
  })

  it('écrit la durée de repos et la fourchette de reps', () => {
    expect(reposFr(120)).toBe('2 min')
    expect(reposFr(90)).toBe('1 min 30')
    expect(reposFr(45)).toBe('45 s')
    expect(repsFr([8, 12])).toBe('8-12')
    expect(repsFr([15, 15])).toBe('15')
  })
})
