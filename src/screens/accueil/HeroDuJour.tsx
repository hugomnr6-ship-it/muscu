import { Check, Play } from 'lucide-react'
import { SEANCES } from '../../data/programme'
import type { Donnees, SeanceId, SportRaquette } from '../../data/types'
import type { RefSeance } from '../../logic/agenda'
import { infoCycle, programmeDuJour, prochaineSeanceMuscu } from '../../logic/cycle'
import { dateLongue } from '../../logic/format'
import { nomDuJour, pluriel } from '../../logic/libelles'
import { toutesFaites } from '../../logic/seance'

interface HeroDuJourProps {
  aujourdhui: string
  donnees: Donnees
  onCommencer: (seanceId: SeanceId, decouverte: boolean) => void
  onReprendre: () => void
  onTerminerEnCours: () => void
  onAbandonner: () => void
  onChoisirSeance: () => void
  onBasculerSport: (date: string, sport: SportRaquette) => void
  onApercu: (seance: RefSeance) => void
}

export function HeroDuJour(props: HeroDuJourProps) {
  const {
    aujourdhui,
    donnees,
    onCommencer,
    onReprendre,
    onTerminerEnCours,
    onAbandonner,
    onChoisirSeance,
    onBasculerSport,
    onApercu,
  } = props
  const enCours = donnees.seanceEnCours
  const programme = programmeDuJour(aujourdhui)
  const prochaine = prochaineSeanceMuscu(aujourdhui)
  const texteProchaine = `Prochaine séance : ${nomDuJour(prochaine.date)} (séance ${prochaine.seanceId}).`

  if (enCours && enCours.date !== aujourdhui) {
    return (
      <section className="hero hero--repos" aria-label="Séance non terminée">
        <span className="hero__pill">Séance non terminée</span>
        <h2 className="hero__titre">
          Séance {enCours.seanceId} du {dateLongue(enCours.date).toLowerCase()}
        </h2>
        <p className="hero__texte">
          Tu ne l’as pas terminée. Enregistre ce que tu as fait, puis tu pourras commencer la séance du jour.
        </p>
        <button type="button" className="hero__bouton" onClick={onTerminerEnCours}>
          <Check size={20} strokeWidth={3} aria-hidden="true" />
          Enregistrer et fermer
        </button>
        <button type="button" className="hero__secondaire" onClick={onAbandonner}>
          Abandonner cette séance
        </button>
      </section>
    )
  }

  if (enCours) {
    const seance = SEANCES[enCours.seanceId]
    const faits = enCours.exercices.filter(toutesFaites).length
    return (
      <section className="hero" aria-label="Séance en cours">
        <span className="hero__pill">Séance {enCours.seanceId} · en cours</span>
        <h2 className="hero__titre">{seance.titre}</h2>
        <div className="hero__meta">
          <span>
            {faits} / {pluriel(enCours.exercices.length, 'exercice')} faits
          </span>
        </div>
        <button type="button" className="hero__bouton" onClick={onReprendre}>
          <Play size={20} fill="currentColor" aria-hidden="true" />
          Reprendre
        </button>
        <button type="button" className="hero__secondaire" onClick={onTerminerEnCours}>
          Terminer la séance
        </button>
      </section>
    )
  }

  const faiteAujourdhui = donnees.historique.find((s) => s.date === aujourdhui)
  if (faiteAujourdhui) {
    return (
      <section className="hero hero--fait" aria-label="Séance du jour faite">
        <span className="hero__pill">
          <Check size={14} strokeWidth={3} aria-hidden="true" /> Séance {faiteAujourdhui.seanceId} faite
        </span>
        <h2 className="hero__titre">Bien joué !</h2>
        <p className="hero__texte">{texteProchaine} Pense à tes protéines et à bien dormir.</p>
        <button type="button" className="hero__secondaire" onClick={onChoisirSeance}>
          Faire une autre séance
        </button>
      </section>
    )
  }

  if (programme.activite === 'muscu') {
    const seance = SEANCES[programme.seanceId]
    const allegee = infoCycle(aujourdhui).allegee
    const pill = programme.decouverte
      ? 'Séance découverte'
      : `Séance ${seance.id}${allegee ? ' · semaine légère' : ''}`
    return (
      <section className="hero" aria-label="Séance du jour">
        <span className="hero__pill">{pill}</span>
        <h2 className="hero__titre">{seance.titre}</h2>
        <div className="hero__meta">
          <span>{pluriel(seance.exercices.length, 'exercice')}</span>
          <span>{programme.decouverte ? '2 séries légères · ~50 min' : seance.duree}</span>
        </div>
        {programme.decouverte && (
          <p className="hero__texte">Première séance : prends des charges légères et apprends les réglages.</p>
        )}
        <button type="button" className="hero__bouton" onClick={() => onCommencer(seance.id, programme.decouverte)}>
          <Play size={20} fill="currentColor" aria-hidden="true" />
          Commencer
        </button>
        <button
          type="button"
          className="hero__secondaire"
          onClick={() => onApercu({ seanceId: seance.id, decouverte: programme.decouverte, allegee })}
        >
          Voir le détail de la séance
        </button>
      </section>
    )
  }

  if (programme.activite === 'tennis' || programme.activite === 'padel') {
    const sport = programme.activite
    const fait = donnees.activites[aujourdhui] === sport
    const nom = sport === 'tennis' ? 'Tennis' : 'Padel'
    return (
      <section className={`hero hero--${sport}`} aria-label={`Jour de ${sport}`}>
        <span className="hero__pill">{nom}</span>
        <h2 className="hero__titre">Jour de {sport}</h2>
        <p className="hero__texte">C’est ton cardio du jour. {texteProchaine}</p>
        <button
          type="button"
          className="hero__bouton"
          aria-pressed={fait}
          onClick={() => onBasculerSport(aujourdhui, sport)}
        >
          <Check size={20} strokeWidth={3} aria-hidden="true" />
          {fait ? `${nom} noté` : 'J’ai joué'}
        </button>
        <button type="button" className="hero__secondaire" onClick={onChoisirSeance}>
          Faire une séance de muscu
        </button>
      </section>
    )
  }

  if (programme.activite === 'avant') {
    return (
      <section className="hero" aria-label="Avant le premier entraînement">
        <span className="hero__pill">Bientôt</span>
        <h2 className="hero__titre">Premier entraînement {dateLongue(prochaine.date).toLowerCase()}</h2>
        <p className="hero__texte">Séance découverte : 9 exercices en 2 séries légères, pour apprendre les machines.</p>
        <button type="button" className="hero__bouton" onClick={onChoisirSeance}>
          Voir les séances
        </button>
      </section>
    )
  }

  return (
    <section className="hero hero--repos" aria-label="Jour de repos">
      <span className="hero__pill">Repos</span>
      <h2 className="hero__titre">Jour de repos</h2>
      <p className="hero__texte">Le muscle se construit pendant la récup. {texteProchaine}</p>
      <button type="button" className="hero__secondaire" onClick={onChoisirSeance}>
        Faire une séance quand même
      </button>
    </section>
  )
}
