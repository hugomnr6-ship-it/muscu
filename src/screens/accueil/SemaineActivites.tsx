import { Check } from 'lucide-react'
import type { Activite, SeanceFaite, SportRaquette } from '../../data/types'
import { programmeDuJour } from '../../logic/cycle'
import { ajouterJours, ecartJours, lundiDeLaSemaine } from '../../logic/dates'
import { INITIALE_JOUR, LIBELLE_ACTIVITE } from '../../logic/libelles'

interface SemaineActivitesProps {
  aujourdhui: string
  historique: readonly SeanceFaite[]
  activites: Readonly<Record<string, SportRaquette>>
  onBasculerSport: (date: string, sport: SportRaquette) => void
}

interface Jour {
  date: string
  /** null = avant le début du programme */
  activite: Activite | null
  fait: boolean
}

function activiteDu(date: string): Activite | null {
  const programme = programmeDuJour(date)
  return programme.activite === 'avant' ? null : programme.activite
}

export function SemaineActivites({ aujourdhui, historique, activites, onBasculerSport }: SemaineActivitesProps) {
  const lundi = lundiDeLaSemaine(aujourdhui)
  const jours: Jour[] = Array.from({ length: 7 }, (_, i) => {
    const date = ajouterJours(lundi, i)
    const activite = activiteDu(date)
    const fait =
      activite === 'muscu'
        ? historique.some((s) => s.date === date)
        : activite !== 'repos' && activites[date] === activite
    return { date, activite, fait }
  })
  const prevues = jours.filter((j) => j.activite !== null && j.activite !== 'repos').length
  const faites = jours.filter((j) => j.fait).length

  return (
    <section className="carte" aria-labelledby="titre-semaine">
      <div className="entete-carte">
        <h2 id="titre-semaine" className="carte__titre">
          Cette semaine
        </h2>
        <span className="compteur">
          {faites} / {prevues} activités
        </span>
      </div>
      <div className="semaine">
        {jours.map((jour, i) => {
          const estAujourdhui = jour.date === aujourdhui
          const sport = jour.activite === 'tennis' || jour.activite === 'padel' ? jour.activite : null
          const cliquable = sport !== null && ecartJours(jour.date, aujourdhui) >= 0
          const classes = `jour jour--${jour.activite ?? 'avant'}${estAujourdhui ? ' jour--aujourdhui' : ''}`
          const contenu = (
            <>
              <span className="jour__pilule">
                {INITIALE_JOUR[i]}
                {jour.fait ? (
                  <Check className="jour__fait" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span className="jour__marque" />
                )}
              </span>
              <span className="jour__libelle" aria-hidden="true">
                {jour.activite ? LIBELLE_ACTIVITE[jour.activite] : '—'}
              </span>
            </>
          )
          const etiquette = jour.activite
            ? `${LIBELLE_ACTIVITE[jour.activite]}${jour.fait ? ', fait' : ''}`
            : 'Avant le début du programme'
          return cliquable && sport ? (
            <button
              key={jour.date}
              type="button"
              className={classes}
              aria-label={`${etiquette}. Toucher pour ${jour.fait ? 'annuler' : 'noter comme fait'}`}
              aria-pressed={jour.fait}
              onClick={() => onBasculerSport(jour.date, sport)}
            >
              {contenu}
            </button>
          ) : (
            <div key={jour.date} className={classes}>
              <span className="sr-only">{etiquette}</span>
              {contenu}
            </div>
          )
        })}
      </div>
    </section>
  )
}
