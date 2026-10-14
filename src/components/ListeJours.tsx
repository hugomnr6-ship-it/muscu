import { ChevronRight } from 'lucide-react'
import type { JourAgenda, RefSeance, Tache } from '../logic/agenda'
import { libelleJour } from '../logic/libelles'

interface ListeJoursProps {
  jours: readonly JourAgenda[]
  aujourdhui: string
  onVoirSeance?: (seance: RefSeance) => void
}

function ContenuTache({ tache }: { tache: Tache }) {
  return (
    <>
      <span className="tache__marque" aria-hidden="true" />
      <span className="tache__texte">
        <span className="tache__titre">{tache.titre}</span>
        {tache.detail && <span className="tache__detail">{tache.detail}</span>}
      </span>
    </>
  )
}

/** Agenda jour par jour : la date à gauche, ce qui est prévu à droite. */
export function ListeJours({ jours, aujourdhui, onVoirSeance }: ListeJoursProps) {
  return (
    <ul className="jours">
      {jours.map((jour) => (
        <li key={jour.date} className={`jours__ligne${jour.date === aujourdhui ? ' jours__ligne--aujourdhui' : ''}`}>
          <span className="jours__date">{libelleJour(jour.date, aujourdhui)}</span>
          <ul className="jours__taches">
            {jour.taches.map((tache) => {
              const seance = tache.seance
              return (
                <li key={tache.type} className={`tache tache--${tache.type}`}>
                  {seance && onVoirSeance ? (
                    <button
                      type="button"
                      className="tache__bouton"
                      onClick={() => onVoirSeance(seance)}
                      aria-label={`Voir la ${tache.titre.toLowerCase()}`}
                    >
                      <ContenuTache tache={tache} />
                      <ChevronRight className="tache__chevron" size={18} aria-hidden="true" />
                    </button>
                  ) : (
                    <ContenuTache tache={tache} />
                  )}
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ul>
  )
}
