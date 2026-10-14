import { Check } from 'lucide-react'
import { CYCLE } from '../../data/cycle'
import { semaineDuCycle, semainesDuCycle, type TypeSemaine } from '../../logic/cycle'
import { ecartJours } from '../../logic/dates'

const dateCourte = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const court = (iso: string) => dateCourte.format(new Date(`${iso}T12:00:00Z`))

const ETIQUETTE: Readonly<Record<TypeSemaine, string | null>> = {
  normale: null,
  point: 'Point d’étape',
  allegee: 'Semaine légère',
  bilan: 'Bilan',
}

interface LigneProps {
  titre: string
  dates: string
  etiquette: string | null
  etat: 'faite' | 'actuelle' | 'a-venir'
  etape: boolean
}

function Ligne({ titre, dates, etiquette, etat, etape }: LigneProps) {
  return (
    <li className={`frise-v__ligne frise-v__ligne--${etat}${etape ? ' frise-v__ligne--etape' : ''}`}>
      <span className="frise-v__marque" aria-hidden="true">
        {etat === 'faite' && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="frise-v__texte">
        <span className="frise-v__titre">
          {titre}
          {etat === 'actuelle' && <span className="sr-only"> (en cours)</span>}
        </span>
        <span className="frise-v__dates">{dates}</span>
      </span>
      {etiquette && <span className="frise-v__etiquette">{etiquette}</span>}
    </li>
  )
}

export function FriseCycle({ aujourdhui }: { aujourdhui: string }) {
  const actuelle = semaineDuCycle(aujourdhui)
  const decouverteFaite = ecartJours(CYCLE.decouverte, aujourdhui) > 0 && actuelle > 0
  return (
    <section className="carte" aria-labelledby="titre-frise">
      <h2 id="titre-frise" className="carte__titre">
        Phase 1 · 12 semaines
      </h2>
      <ol className="frise-v">
        <Ligne
          titre="Découverte"
          dates={court(CYCLE.decouverte)}
          etiquette="Séance C légère"
          etat={actuelle === 0 ? 'actuelle' : decouverteFaite ? 'faite' : 'a-venir'}
          etape={false}
        />
        {semainesDuCycle().map((semaine) => (
          <Ligne
            key={semaine.numero}
            titre={`Semaine ${semaine.numero}`}
            dates={`${court(semaine.debut)} – ${court(semaine.fin)}`}
            etiquette={ETIQUETTE[semaine.type]}
            etat={semaine.numero < actuelle ? 'faite' : semaine.numero === actuelle ? 'actuelle' : 'a-venir'}
            etape={semaine.type === 'point' || semaine.type === 'bilan'}
          />
        ))}
      </ol>
    </section>
  )
}
