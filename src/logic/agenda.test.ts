import { describe, expect, it } from 'vitest'
import { joursDeLaSemaine, prochainsJours, tachesDuJour } from './agenda'

const types = (iso: string) => tachesDuJour(iso).map((t) => t.type)

describe('tachesDuJour', () => {
  it('ne prévoit rien avant le premier entraînement', () => {
    expect(tachesDuJour('2026-10-14')).toEqual([])
  })

  it('prévoit la séance découverte, la pesée et les photos le 16 octobre', () => {
    const taches = tachesDuJour('2026-10-16')
    expect(taches.map((t) => t.type)).toEqual(['muscu', 'pesee', 'photos'])
    expect(taches[0]).toMatchObject({ titre: 'Séance découverte', detail: 'Séance C en 2 séries légères' })
  })

  it('donne la séance du jour avec son contenu', () => {
    expect(tachesDuJour('2026-10-19')).toEqual([
      { type: 'muscu', titre: 'Séance A', detail: 'Pecs, dos, jambes légères' },
    ])
  })

  it('prévoit tennis, padel et repos selon le planning', () => {
    expect(types('2026-10-20')).toEqual(['tennis'])
    expect(types('2026-10-24')).toEqual(['repos'])
    expect(types('2026-10-25')).toEqual(['padel'])
  })

  it('ajoute la pesée chaque vendredi', () => {
    expect(types('2026-10-23')).toEqual(['muscu', 'pesee'])
  })

  it('prévoit photos et point d’étape le vendredi de la semaine 6', () => {
    expect(types('2026-11-27')).toEqual(['muscu', 'pesee', 'photos', 'point'])
  })

  it('annonce la semaine légère et allège la séance', () => {
    const taches = tachesDuJour('2026-12-28')
    expect(taches.map((t) => t.type)).toEqual(['muscu', 'legere'])
    expect(taches[0].detail).toBe('Pecs, dos, jambes légères · une série de moins')
  })

  it('prévoit le bilan le vendredi de la semaine 12', () => {
    expect(types('2027-01-08')).toEqual(['muscu', 'pesee', 'photos', 'bilan'])
  })
})

describe('joursDeLaSemaine', () => {
  it('liste les 7 jours du lundi au dimanche', () => {
    const jours = joursDeLaSemaine('2026-10-21')
    expect(jours.map((j) => j.date)).toEqual([
      '2026-10-19',
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
    ])
    expect(jours[2].taches[0].titre).toBe('Séance B')
  })
})

describe('prochainsJours', () => {
  it('donne les prochains jours qui ont quelque chose de prévu, sans aujourd’hui', () => {
    expect(prochainsJours('2026-10-14', 3).map((j) => j.date)).toEqual(['2026-10-16', '2026-10-17', '2026-10-18'])
    expect(prochainsJours('2026-10-19', 2).map((j) => j.date)).toEqual(['2026-10-20', '2026-10-21'])
  })
})
