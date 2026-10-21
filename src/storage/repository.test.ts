import { beforeEach, describe, expect, it } from 'vitest'
import type { Donnees } from '../data/types'
import { SEANCES } from '../data/programme'
import { seanceFaite, s } from '../logic/fixtures'
import { creerSeance, reducteurSeance } from '../logic/seance'
import { CLE, CLE_CORROMPUE, charger, donneesVides, exporter, importer, sauvegarder } from './repository'

class MemoireStorage {
  private readonly valeurs = new Map<string, string>()
  getItem(cle: string): string | null {
    return this.valeurs.get(cle) ?? null
  }
  setItem(cle: string, valeur: string): void {
    this.valeurs.set(cle, valeur)
  }
}

const exemple: Donnees = {
  ...donneesVides(),
  historique: [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12)] })],
  pesees: [{ date: '2026-10-16', poids: 70.2, taille: 80 }],
  activites: { '2026-10-20': 'tennis' },
}

describe('repository', () => {
  let storage: MemoireStorage

  beforeEach(() => {
    storage = new MemoireStorage()
  })

  it('renvoie des données vides au premier lancement', () => {
    expect(charger(storage)).toEqual(donneesVides())
  })

  it('relit ce qui a été sauvegardé', () => {
    sauvegarder(storage, exemple)
    expect(charger(storage)).toEqual(exemple)
  })

  it('corrige et réenregistre un exercice noté sous le mauvais nom', () => {
    const malNote: Donnees = {
      ...exemple,
      historique: [seanceFaite('2026-10-21', { 'oiseau-machine': [s(25, 12)] }, 'B')],
    }
    sauvegarder(storage, malNote)

    const relues = charger(storage)

    expect(relues.historique[0].exercices).toEqual([{ exerciceId: 'pec-deck', series: [s(25, 12)] }])
    expect(JSON.parse(storage.getItem(CLE) ?? '')).toEqual(relues)
  })

  it('relit une séance en cours (reprise après fermeture de l’appli)', () => {
    let enCours = creerSeance(SEANCES.B, exemple.historique, {
      date: '2026-10-21',
      now: 1_800_000_000_000,
      decouverte: false,
      allegee: false,
    })
    enCours = reducteurSeance(enCours, { type: 'valider', now: 1_800_000_000_000 })
    const avecSeance: Donnees = { ...exemple, seanceEnCours: enCours }
    sauvegarder(storage, avecSeance)
    expect(charger(storage)).toEqual(avecSeance)
  })

  it('rejette une séance en cours incohérente', () => {
    const enCours = creerSeance(SEANCES.A, [], { date: '2026-10-19', now: 1, decouverte: false, allegee: false })
    const cassees = [
      { ...enCours, index: 99 },
      { ...enCours, exercices: [] },
      { ...enCours, reposFinA: 'bientôt' },
      { ...enCours, seanceId: 'Z' },
      { ...enCours, exercices: [{ ...enCours.exercices[0], reps: [8] }] },
    ]
    for (const seanceEnCours of cassees) {
      storage.setItem(CLE, JSON.stringify({ ...exemple, seanceEnCours }))
      expect(charger(storage)).toEqual(donneesVides())
    }
  })

  it('rejette des activités ou une version inconnues', () => {
    storage.setItem(CLE, JSON.stringify({ ...exemple, activites: { '2026-10-20': 'foot' } }))
    expect(charger(storage)).toEqual(donneesVides())
    storage.setItem(CLE, JSON.stringify({ ...exemple, version: 2 }))
    expect(charger(storage)).toEqual(donneesVides())
  })

  it('ignore les exercices inconnus au lieu de faire planter l’appli', () => {
    const avecInconnu = {
      ...exemple,
      historique: [
        seanceFaite('2026-10-19', { 'chest-press': [s(30, 12)], 'ancien-exercice': [s(10, 10)] }),
        seanceFaite('2026-10-21', { 'ancien-exercice': [s(10, 10)] }),
      ],
      seanceEnCours: {
        ...creerSeance(SEANCES.A, [], { date: '2026-10-26', now: 1, decouverte: false, allegee: false }),
        exercices: [{ exerciceId: 'ancien-exercice', reps: [8, 12], reposSec: 90, series: [{ kg: 1, reps: 1, faite: false }] }],
      },
    }
    storage.setItem(CLE, JSON.stringify(avecInconnu))
    const relues = charger(storage)
    expect(relues.historique).toHaveLength(1)
    expect(relues.historique[0].exercices.map((e) => e.exerciceId)).toEqual(['chest-press'])
    expect(relues.seanceEnCours).toBeNull()
  })

  it('refuse des dates impossibles et des valeurs absurdes', () => {
    const mauvaiseDate = { ...exemple, pesees: [{ date: '2026-99-99', poids: 70, taille: 80 }] }
    expect(importer(JSON.stringify({ app: 'muscu', donnees: mauvaiseDate }))).toMatchObject({ ok: false })
    const serieAbsurde = { ...exemple, historique: [seanceFaite('2026-10-19', { 'chest-press': [s(5000, 12)] })] }
    expect(importer(JSON.stringify({ app: 'muscu', donnees: serieAbsurde }))).toMatchObject({ ok: false })
  })

  it('trie les pesées et en garde une par semaine', () => {
    const desordre = {
      ...exemple,
      pesees: [
        { date: '2026-10-23', poids: 70.5, taille: 80 },
        { date: '2026-10-16', poids: 70, taille: 80 },
        { date: '2026-10-24', poids: 70.6, taille: 80 },
      ],
    }
    const resultat = importer(JSON.stringify({ app: 'muscu', donnees: desordre }))
    expect(resultat.ok && resultat.donnees.pesees.map((p) => p.date)).toEqual(['2026-10-16', '2026-10-24'])
  })

  it('met de côté des données illisibles au lieu de les perdre', () => {
    storage.setItem(CLE, '{pas du json')
    expect(charger(storage)).toEqual(donneesVides())
    expect(storage.getItem(CLE_CORROMPUE)).toBe('{pas du json')
  })

  it('exporte puis réimporte une sauvegarde', () => {
    const resultat = importer(exporter(exemple))
    expect(resultat).toEqual({ ok: true, donnees: exemple })
  })

  it('refuse un fichier qui n’est pas une sauvegarde', () => {
    expect(importer('bonjour')).toMatchObject({ ok: false })
    expect(importer(JSON.stringify({ app: 'autre' }))).toMatchObject({ ok: false })
    expect(importer(JSON.stringify({ app: 'muscu', donnees: { ...exemple, historique: 'x' } }))).toMatchObject({
      ok: false,
    })
  })

  it('refuse une pesée ou une série mal formée', () => {
    const peseeInvalide = { ...exemple, pesees: [{ date: '2026-10-16', poids: '70', taille: 80 }] }
    expect(importer(JSON.stringify({ app: 'muscu', donnees: peseeInvalide }))).toMatchObject({ ok: false })
    const serieInvalide = {
      ...exemple,
      historique: [{ ...exemple.historique[0], exercices: [{ exerciceId: 'x', series: [{ kg: -1, reps: 3 }] }] }],
    }
    expect(importer(JSON.stringify({ app: 'muscu', donnees: serieInvalide }))).toMatchObject({ ok: false })
  })
})
