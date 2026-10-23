import { describe, expect, it } from 'vitest'
import { SEANCES } from '../data/programme'
import type { SeanceEnCours } from '../data/types'
import { s, seanceFaite } from './fixtures'
import { creerSeance, exerciceRemplacant, reducteurSeance, serieCourante, terminerSeance, toutesFaites } from './seance'

const NOW = 1_800_000_000_000

function nouvelle(options: Partial<Parameters<typeof creerSeance>[2]> = {}, historique = [seanceFaite('2026-10-19', {})]) {
  return creerSeance(SEANCES.A, historique, {
    date: '2026-10-26',
    now: NOW,
    decouverte: false,
    allegee: false,
    ...options,
  })
}

describe('creerSeance', () => {
  it('prépare 2 séries par exercice pour la séance découverte, charges à 0', () => {
    const seance = creerSeance(SEANCES.C, [], { date: '2026-10-16', now: NOW, decouverte: true, allegee: false })
    expect(seance.exercices).toHaveLength(SEANCES.C.exercices.length)
    expect(seance.exercices.every((e) => e.series.length === 2)).toBe(true)
    expect(seance.exercices[0].series[0]).toEqual({ kg: 0, reps: 10, faite: false })
    expect(seance).toMatchObject({ seanceId: 'C', index: 0, reposFinA: null, decouverte: true })
  })

  it('pré-remplit la charge avec la suggestion', () => {
    const historique = [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(30, 12), s(30, 12)] })]
    const seance = nouvelle({}, historique)
    expect(seance.exercices[0].series.map((x) => x.kg)).toEqual([32.5, 32.5, 32.5])
  })

  it('pré-remplit les reps : milieu de fourchette la 1re fois, bas de fourchette après une hausse', () => {
    expect(nouvelle({}, []).exercices[0].series[0].reps).toBe(10)
    const hausse = [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(30, 12), s(30, 12)] })]
    expect(nouvelle({}, hausse).exercices[0].series.map((x) => x.reps)).toEqual([8, 8, 8])
  })

  it('reprend les reps de la dernière fois quand la charge ne change pas', () => {
    const garde = [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12), s(30, 10)] })]
    expect(nouvelle({}, garde).exercices[0].series.map((x) => x.reps)).toEqual([12, 10, 10])
  })

  it("démarre les tractions assistées avec une aide prudente la première fois", () => {
    const seance = creerSeance(SEANCES.B, [], { date: '2026-10-21', now: NOW, decouverte: false, allegee: false })
    expect(seance.exercices[0].series[0].kg).toBe(30)
  })

  it('retire une série en semaine allégée (minimum 2)', () => {
    const seance = creerSeance(SEANCES.C, [], { date: '2026-12-28', now: NOW, decouverte: false, allegee: true })
    expect(seance.exercices[0].series).toHaveLength(3)
    expect(seance.exercices[1].series).toHaveLength(2)
  })
})

describe('reducteurSeance', () => {
  it('ajuste la série en cours sans descendre sous 0', () => {
    let seance = nouvelle()
    seance = reducteurSeance(seance, { type: 'ajuster', champ: 'kg', delta: 2.5 })
    expect(seance.exercices[0].series[0].kg).toBe(2.5)
    seance = reducteurSeance(seance, { type: 'ajuster', champ: 'kg', delta: -5 })
    expect(seance.exercices[0].series[0].kg).toBe(0)
    seance = reducteurSeance(seance, { type: 'ajuster', champ: 'reps', delta: -1 })
    expect(seance.exercices[0].series[0].reps).toBe(9)
  })

  it('accepte une valeur tapée au clavier et ignore les valeurs invalides', () => {
    let seance = nouvelle()
    seance = reducteurSeance(seance, { type: 'definir', champ: 'kg', valeur: 37.456 })
    expect(seance.exercices[0].series[0].kg).toBe(37.46)
    const avant = seance
    seance = reducteurSeance(seance, { type: 'definir', champ: 'kg', valeur: Number.NaN })
    expect(seance).toBe(avant)
    seance = reducteurSeance(seance, { type: 'definir', champ: 'reps', valeur: -4 })
    expect(seance.exercices[0].series[0].reps).toBe(0)
  })

  it('valide la série, reporte la charge sur la suivante et lance le repos', () => {
    let seance = nouvelle()
    seance = reducteurSeance(seance, { type: 'definir', champ: 'kg', valeur: 40 })
    seance = reducteurSeance(seance, { type: 'valider', now: NOW })
    const exo = seance.exercices[0]
    expect(exo.series[0]).toEqual({ kg: 40, reps: 10, faite: true })
    expect(exo.series[1].kg).toBe(40)
    expect(seance.reposFinA).toBe(NOW + 120_000)
    expect(seance.reposDuree).toBe(120)
    expect(serieCourante(exo)).toBe(1)
  })

  it('ne lance pas de repos après la dernière série', () => {
    let seance = nouvelle()
    for (let i = 0; i < 3; i++) seance = reducteurSeance(seance, { type: 'valider', now: NOW })
    expect(toutesFaites(seance.exercices[0])).toBe(true)
    expect(serieCourante(seance.exercices[0])).toBe(-1)
    expect(seance.reposFinA).toBeNull()
    const apres = reducteurSeance(seance, { type: 'valider', now: NOW })
    expect(apres).toBe(seance)
  })

  it('rouvre une série validée par erreur', () => {
    let seance = reducteurSeance(nouvelle(), { type: 'valider', now: NOW })
    seance = reducteurSeance(seance, { type: 'valider', now: NOW })
    seance = reducteurSeance(seance, { type: 'rouvrir', serie: 0 })
    expect(seance.exercices[0].series.map((x) => x.faite)).toEqual([false, true, false])
    expect(serieCourante(seance.exercices[0])).toBe(0)
    seance = reducteurSeance(seance, { type: 'definir', champ: 'reps', valeur: 9 })
    expect(seance.exercices[0].series[0].reps).toBe(9)
    expect(reducteurSeance(seance, { type: 'rouvrir', serie: 7 })).toBe(seance)
  })

  it('note le moment de la dernière série validée', () => {
    const seance = reducteurSeance(nouvelle(), { type: 'valider', now: NOW + 60_000 })
    expect(seance.derniereAction).toBe(NOW + 60_000)
  })

  it('gère le minuteur : +30 s et passer', () => {
    let seance = reducteurSeance(nouvelle(), { type: 'valider', now: NOW })
    seance = reducteurSeance(seance, { type: 'ajouterRepos', now: NOW + 1_000, secondes: 30 })
    expect(seance.reposFinA).toBe(NOW + 150_000)
    seance = reducteurSeance(seance, { type: 'passerRepos' })
    expect(seance.reposFinA).toBeNull()
  })

  it("navigue entre les exercices dans les limites de la séance", () => {
    let seance = nouvelle()
    seance = reducteurSeance(seance, { type: 'suivant' })
    expect(seance.index).toBe(1)
    seance = reducteurSeance(seance, { type: 'allerA', index: 99 })
    expect(seance.index).toBe(6)
    seance = reducteurSeance(seance, { type: 'suivant' })
    expect(seance.index).toBe(6)
    seance = reducteurSeance(seance, { type: 'allerA', index: -2 })
    expect(seance.index).toBe(0)
  })

  it('ne modifie pas la séance d’origine', () => {
    const seance = nouvelle()
    const copie = structuredClone(seance)
    reducteurSeance(seance, { type: 'valider', now: NOW })
    reducteurSeance(seance, { type: 'ajuster', champ: 'kg', delta: 5 })
    expect(seance).toEqual(copie)
  })
})

describe('remplacement par le plan B', () => {
  const seanceB = (historique = [seanceFaite('2026-10-19', {})]) =>
    creerSeance(SEANCES.B, historique, { date: '2026-10-21', now: NOW, decouverte: false, allegee: false })

  it('fait le tirage vertical à la place des tractions, avec la charge de son historique', () => {
    const historique = [seanceFaite('2026-10-19', { 'tirage-vertical': [s(35, 12), s(35, 12), s(35, 12)] })]
    const seance = seanceB(historique)
    const tirage = exerciceRemplacant(seance.exercices[0], 'tirage-vertical', historique)
    const apres = reducteurSeance(seance, { type: 'remplacer', exercice: tirage })
    expect(apres.exercices[0].exerciceId).toBe('tirage-vertical')
    expect(apres.exercices[0].series.map((x) => x.kg)).toEqual([37.5, 37.5, 37.5])
    expect(apres.exercices[0].reps).toEqual(seance.exercices[0].reps)
    expect(apres.exercices.slice(1)).toEqual(seance.exercices.slice(1))
  })

  it('garde le nombre de séries prévu (séance allégée comprise)', () => {
    const allegee = creerSeance(SEANCES.B, [], { date: '2026-12-28', now: NOW, decouverte: false, allegee: true })
    expect(exerciceRemplacant(allegee.exercices[0], 'tirage-vertical', []).series).toHaveLength(2)
  })

  it("ne remplace plus l'exercice une fois une série validée", () => {
    const seance = reducteurSeance(seanceB(), { type: 'valider', now: NOW })
    const apres = reducteurSeance(seance, { type: 'remplacer', exercice: exerciceRemplacant(seance.exercices[0], 'tirage-vertical', []) })
    expect(apres).toBe(seance)
  })
})

describe('terminerSeance', () => {
  it('ne garde que les séries faites et les exercices commencés', () => {
    let seance: SeanceEnCours = nouvelle()
    seance = reducteurSeance(seance, { type: 'definir', champ: 'kg', valeur: 30 })
    seance = reducteurSeance(seance, { type: 'valider', now: NOW })
    const faite = terminerSeance(seance, NOW + 120_000)
    expect(faite).toMatchObject({ seanceId: 'A', date: '2026-10-26', debut: NOW, fin: NOW + 120_000 })
    expect(faite.exercices).toEqual([{ exerciceId: 'chest-press', series: [{ kg: 30, reps: 10 }] }])
  })

  it("ne compte pas les heures où la séance est restée ouverte sans rien faire", () => {
    const seance = reducteurSeance(nouvelle(), { type: 'valider', now: NOW + 40 * 60_000 })
    const faite = terminerSeance(seance, NOW + 72 * 3_600_000)
    expect(faite.fin).toBe(NOW + 45 * 60_000)
  })
})
