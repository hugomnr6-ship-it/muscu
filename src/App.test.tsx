import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { SEANCES } from './data/programme'
import type { Donnees } from './data/types'
import { s, seanceFaite } from './logic/fixtures'
import { creerSeance, reducteurSeance } from './logic/seance'
import { PeseeFeuille } from './screens/PeseeFeuille'
import { CLE, donneesVides } from './storage/repository'

function demarrer(date: string, donnees: Donnees): void {
  window.history.replaceState(null, '', `/?date=${date}`)
  window.localStorage.setItem(CLE, JSON.stringify(donnees))
  render(<App />)
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('propose de clore une séance oubliée un autre jour au lieu de la reprendre', () => {
    const oubliee = creerSeance(SEANCES.C, [], { date: '2026-10-16', now: 1, decouverte: true, allegee: false })
    demarrer('2026-10-19', { ...donneesVides(), seanceEnCours: oubliee })
    expect(screen.getByText('Séance non terminée')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Abandonner cette séance/ }))
    expect(screen.getByRole('button', { name: /Commencer/ })).toBeTruthy()
  })

  it('rouvre directement la séance du jour et permet de corriger une série', () => {
    const enCours = reducteurSeance(
      creerSeance(SEANCES.A, [], { date: '2026-10-19', now: Date.now(), decouverte: false, allegee: false }),
      { type: 'valider', now: Date.now() },
    )
    demarrer('2026-10-19', { ...donneesVides(), seanceEnCours: enCours })
    expect(screen.getByRole('heading', { name: 'Chest press machine' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Série 1 faite/ }))
    expect(screen.getByRole('button', { name: 'Valider la série 1' })).toBeTruthy()
  })

  it("affiche la progression même si l'historique contient un exercice retiré", () => {
    const historique = [seanceFaite('2026-10-19', { 'chest-press': [s(30, 12)], 'ancien-exercice': [s(5, 5)] })]
    demarrer('2026-10-21', { ...donneesVides(), historique })
    fireEvent.click(screen.getByRole('button', { name: 'Progression' }))
    expect(screen.getByRole('heading', { name: 'Progression' })).toBeTruthy()
    expect(screen.getAllByText('30 kg × 12').length).toBeGreaterThan(0)
  })

  it('annonce les prochains jours sur l’accueil', () => {
    demarrer('2026-10-19', donneesVides())
    const aVenir = screen.getByRole('region', { name: 'À venir' })
    expect(aVenir.textContent).toContain('Demain')
    expect(aVenir.textContent).toContain('Tennis')
    expect(aVenir.textContent).toContain('Séance B')
  })

  it('déplie une semaine du calendrier pour voir chaque jour', () => {
    demarrer('2026-10-19', donneesVides())
    fireEvent.click(screen.getByRole('button', { name: 'Tout le calendrier' }))
    expect(screen.getByText('Pecs, dos, jambes légères')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Semaine 6/ }))
    expect(screen.getByText('Point d’étape', { selector: '.tache__titre' })).toBeTruthy()
  })

  it('montre un aperçu de la séance avant de la commencer', () => {
    demarrer('2026-10-19', donneesVides())
    fireEvent.click(screen.getByRole('button', { name: 'Voir le détail de la séance' }))
    const apercu = screen.getByRole('dialog', { name: 'Séance A' })
    expect(apercu.textContent).toContain('Chest press machine')
    expect(apercu.textContent).toContain('3 × 8-12 reps · repos 2 min')
    fireEvent.click(screen.getByRole('button', { name: /Chest press machine/ }))
    expect(screen.getByText(/Règle le siège/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Commencer cette séance' }))
    expect(screen.getByRole('heading', { name: 'Chest press machine', level: 1 })).toBeTruthy()
  })

  it('signale une date simulée', () => {
    demarrer('2026-10-16', donneesVides())
    expect(screen.getByText(/Date simulée/)).toBeTruthy()
  })
})

describe('PeseeFeuille', () => {
  afterEach(cleanup)

  it('ne change pas la valeur quand on touche le libellé', () => {
    render(<PeseeFeuille aujourdhui="2026-10-16" pesees={[]} onEnregistrer={() => {}} onFermer={() => {}} />)
    fireEvent.click(screen.getByText('Poids (kg)'))
    expect((screen.getByLabelText('poids en kilos') as HTMLInputElement).value).toBe('70')
  })

  it('enregistre la pesée du jour', () => {
    const enregistrer = vi.fn()
    render(<PeseeFeuille aujourdhui="2026-10-16" pesees={[]} onEnregistrer={enregistrer} onFermer={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Plus poids en kilos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(enregistrer).toHaveBeenCalledWith({ date: '2026-10-16', poids: 70.1, taille: 80 })
  })
})
