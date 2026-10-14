import { describe, expect, it } from 'vitest'
import { infoCycle, programmeDuJour, prochaineSeanceMuscu, semaineDuCycle, semainesDuCycle } from './cycle'

describe('semaineDuCycle', () => {
  it('compte la semaine découverte comme semaine 0', () => {
    expect(semaineDuCycle('2026-10-16')).toBe(0)
    expect(semaineDuCycle('2026-10-18')).toBe(0)
  })

  it('numérote les semaines à partir du lundi 19 octobre', () => {
    expect(semaineDuCycle('2026-10-19')).toBe(1)
    expect(semaineDuCycle('2026-10-25')).toBe(1)
    expect(semaineDuCycle('2026-10-26')).toBe(2)
    expect(semaineDuCycle('2026-11-23')).toBe(6)
    expect(semaineDuCycle('2027-01-10')).toBe(12)
    expect(semaineDuCycle('2027-01-11')).toBe(13)
  })
})

describe('infoCycle', () => {
  it('annonce le point d’étape à venir', () => {
    expect(infoCycle('2026-11-02')).toMatchObject({ semaine: 3, termine: false, prochaineEtape: { type: 'point', dans: 3 } })
    expect(infoCycle('2026-10-16').prochaineEtape).toEqual({ type: 'point', dans: 6 })
    expect(infoCycle('2026-11-25').prochaineEtape).toEqual({ type: 'point', dans: 0 })
  })

  it('annonce ensuite le bilan', () => {
    expect(infoCycle('2026-11-30').prochaineEtape).toEqual({ type: 'bilan', dans: 5 })
    expect(infoCycle('2027-01-06').prochaineEtape).toEqual({ type: 'bilan', dans: 0 })
  })

  it('signale la semaine allégée et la fin du cycle', () => {
    expect(infoCycle('2026-12-28').allegee).toBe(true)
    expect(infoCycle('2026-12-21').allegee).toBe(false)
    expect(infoCycle('2027-01-12')).toMatchObject({ termine: true, prochaineEtape: null })
  })
})

describe('programmeDuJour', () => {
  it('fait de vendredi 16 octobre la séance C découverte', () => {
    expect(programmeDuJour('2026-10-16')).toEqual({ activite: 'muscu', seanceId: 'C', decouverte: true })
  })

  it('suit le planning de la semaine type', () => {
    expect(programmeDuJour('2026-10-19')).toEqual({ activite: 'muscu', seanceId: 'A', decouverte: false })
    expect(programmeDuJour('2026-10-20')).toEqual({ activite: 'tennis' })
    expect(programmeDuJour('2026-10-21')).toEqual({ activite: 'muscu', seanceId: 'B', decouverte: false })
    expect(programmeDuJour('2026-10-23')).toEqual({ activite: 'muscu', seanceId: 'C', decouverte: false })
    expect(programmeDuJour('2026-10-24')).toEqual({ activite: 'repos' })
    expect(programmeDuJour('2026-10-25')).toEqual({ activite: 'padel' })
  })

  it('indique que le programme n’a pas commencé avant le 16 octobre', () => {
    expect(programmeDuJour('2026-10-14')).toEqual({ activite: 'avant' })
  })
})

describe('prochaineSeanceMuscu', () => {
  it('trouve la prochaine séance après la date donnée', () => {
    expect(prochaineSeanceMuscu('2026-10-20')).toEqual({ date: '2026-10-21', seanceId: 'B' })
    expect(prochaineSeanceMuscu('2026-10-17')).toEqual({ date: '2026-10-19', seanceId: 'A' })
    expect(prochaineSeanceMuscu('2026-10-14')).toEqual({ date: '2026-10-16', seanceId: 'C' })
  })

  it('renvoie la séance découverte même longtemps avant le début', () => {
    expect(prochaineSeanceMuscu('2026-10-01')).toEqual({ date: '2026-10-16', seanceId: 'C' })
  })
})

describe('semainesDuCycle', () => {
  it('liste les 12 semaines avec leurs étapes', () => {
    const semaines = semainesDuCycle()
    expect(semaines).toHaveLength(12)
    expect(semaines[0]).toEqual({ numero: 1, debut: '2026-10-19', fin: '2026-10-25', type: 'normale' })
    expect(semaines[5].type).toBe('point')
    expect(semaines[10].type).toBe('allegee')
    expect(semaines[11]).toMatchObject({ type: 'bilan', debut: '2027-01-04', fin: '2027-01-10' })
  })
})
