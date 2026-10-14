import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ListeJours } from '../../components/ListeJours'
import { CYCLE } from '../../data/cycle'
import { joursDeLaSemaine } from '../../logic/agenda'
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

type Etat = 'faite' | 'actuelle' | 'a-venir'

interface SemaineFrise {
  numero: number
  titre: string
  dates: string
  /** Un jour de la semaine, pour en retrouver le détail. */
  jourRepere: string
  etiquette: string | null
  etat: Etat
  etape: boolean
}

interface LigneProps {
  semaine: SemaineFrise
  aujourdhui: string
  ouverte: boolean
  onBasculer: () => void
}

function Ligne({ semaine, aujourdhui, ouverte, onBasculer }: LigneProps) {
  const jours = joursDeLaSemaine(semaine.jourRepere).filter((jour) => jour.taches.length > 0)
  const classes = `frise-v__ligne frise-v__ligne--${semaine.etat}${semaine.etape ? ' frise-v__ligne--etape' : ''}`
  return (
    <li className="frise-v__item">
      <button type="button" className={classes} aria-expanded={ouverte} onClick={onBasculer}>
        <span className="frise-v__marque" aria-hidden="true">
          {semaine.etat === 'faite' && <Check size={14} strokeWidth={3} />}
        </span>
        <span className="frise-v__texte">
          <span className="frise-v__titre">
            {semaine.titre}
            {semaine.etat === 'actuelle' && <span className="sr-only"> (en cours)</span>}
          </span>
          <span className="frise-v__dates">{semaine.dates}</span>
        </span>
        {semaine.etiquette && <span className="frise-v__etiquette">{semaine.etiquette}</span>}
        <ChevronDown className="frise-v__chevron" size={18} aria-hidden="true" />
      </button>
      {ouverte && (
        <div className="frise-v__detail">
          <ListeJours jours={jours} aujourdhui={aujourdhui} />
        </div>
      )}
    </li>
  )
}

function etatDe(numero: number, actuelle: number): Etat {
  if (numero < actuelle) return 'faite'
  return numero === actuelle ? 'actuelle' : 'a-venir'
}

export function FriseCycle({ aujourdhui }: { aujourdhui: string }) {
  const actuelle = semaineDuCycle(aujourdhui)
  const [ouverte, setOuverte] = useState<number | null>(Math.min(actuelle, CYCLE.semaines))
  const decouverteFaite = ecartJours(CYCLE.decouverte, aujourdhui) > 0 && actuelle > 0

  const semaines: SemaineFrise[] = [
    {
      numero: 0,
      titre: 'Découverte',
      dates: court(CYCLE.decouverte),
      jourRepere: CYCLE.decouverte,
      etiquette: 'Séance C légère',
      etat: actuelle === 0 ? 'actuelle' : decouverteFaite ? 'faite' : 'a-venir',
      etape: false,
    },
    ...semainesDuCycle().map((semaine) => ({
      numero: semaine.numero,
      titre: `Semaine ${semaine.numero}`,
      dates: `${court(semaine.debut)} – ${court(semaine.fin)}`,
      jourRepere: semaine.debut,
      etiquette: ETIQUETTE[semaine.type],
      etat: etatDe(semaine.numero, actuelle),
      etape: semaine.type === 'point' || semaine.type === 'bilan',
    })),
  ]

  return (
    <section className="carte" aria-labelledby="titre-frise">
      <h2 id="titre-frise" className="carte__titre">
        Calendrier · 12 semaines
      </h2>
      <p className="texte-2 carte__texte">Touche une semaine pour voir ce qui est prévu chaque jour.</p>
      <ol className="frise-v">
        {semaines.map((semaine) => (
          <Ligne
            key={semaine.numero}
            semaine={semaine}
            aujourdhui={aujourdhui}
            ouverte={ouverte === semaine.numero}
            onBasculer={() => setOuverte((o) => (o === semaine.numero ? null : semaine.numero))}
          />
        ))}
      </ol>
    </section>
  )
}
