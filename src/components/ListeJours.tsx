import type { JourAgenda } from '../logic/agenda'
import { libelleJour } from '../logic/libelles'

interface ListeJoursProps {
  jours: readonly JourAgenda[]
  aujourdhui: string
}

/** Agenda jour par jour : la date à gauche, ce qui est prévu à droite. */
export function ListeJours({ jours, aujourdhui }: ListeJoursProps) {
  return (
    <ul className="jours">
      {jours.map((jour) => (
        <li key={jour.date} className={`jours__ligne${jour.date === aujourdhui ? ' jours__ligne--aujourdhui' : ''}`}>
          <span className="jours__date">{libelleJour(jour.date, aujourdhui)}</span>
          <ul className="jours__taches">
            {jour.taches.map((tache) => (
              <li key={tache.type} className={`tache tache--${tache.type}`}>
                <span className="tache__marque" aria-hidden="true" />
                <span>
                  <span className="tache__titre">{tache.titre}</span>
                  {tache.detail && <span className="tache__detail">{tache.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
