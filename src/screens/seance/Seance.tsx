import { useEffect, useRef, useState } from 'react'
import { exercice as trouverExercice } from '../../data/catalogue'
import type { SeanceEnCours, SeanceFaite } from '../../data/types'
import { useMaintenant } from '../../hooks/useMaintenant'
import { debloquerSon, signalFinRepos } from '../../lib/signal'
import { reposFr, repsFr } from '../../logic/format'
import { restant } from '../../logic/minuteur'
import type { ActionSeance, ChampSerie } from '../../logic/seance'
import { toutesFaites } from '../../logic/seance'
import { derniereFois, suggererCharge } from '../../logic/suggestion'
import { BarreAction } from './BarreAction'
import { ListeExercices } from './ListeExercices'
import { MediaExercice } from './MediaExercice'
import { Series } from './Series'
import { Technique } from './Technique'
import { TuilesPerf } from './TuilesPerf'
import './seance.css'

const SECONDES_AJOUT = 30
/** Au-delà, le repos s'est fini pendant que l'appli était fermée : pas de bip en la rouvrant. */
const FENETRE_SIGNAL_MS = 3_000

interface SeanceProps {
  seance: SeanceEnCours
  historique: readonly SeanceFaite[]
  onAction: (action: ActionSeance) => void
  onFermer: () => void
  onTerminer: () => void
}

export function Seance({ seance, historique, onAction, onFermer, onTerminer }: SeanceProps) {
  const [lecture, setLecture] = useState(false)
  const [liste, setListe] = useState(false)
  const feuille = useRef<HTMLDivElement>(null)
  const maintenant = useMaintenant(seance.reposFinA !== null)
  const reposRestant = restant(seance.reposFinA, maintenant)

  const enCours = seance.exercices[seance.index]
  const exercice = trouverExercice(enCours.exerciceId)
  const derniere = derniereFois(historique, enCours.exerciceId)
  const suggestion = suggererCharge(derniere?.series ?? null, enCours.reps, exercice.typeCharge, exercice.pasKg)
  const dernierExercice = seance.index === seance.exercices.length - 1
  const fini = toutesFaites(enCours)

  // Fin du repos : bip + vibration une seule fois, puis la barre disparaît.
  useEffect(() => {
    if (seance.reposFinA !== null && reposRestant === 0) {
      if (Date.now() - seance.reposFinA < FENETRE_SIGNAL_MS) signalFinRepos()
      onAction({ type: 'passerRepos' })
    }
  }, [seance.reposFinA, reposRestant, onAction])

  // Nouvel exercice : on coupe la vidéo et on remonte en haut.
  useEffect(() => {
    setLecture(false)
    if (feuille.current) feuille.current.scrollTop = 0
  }, [seance.index])

  const definir = (champ: ChampSerie, valeur: number) => onAction({ type: 'definir', champ, valeur })
  const valider = () => {
    debloquerSon()
    onAction({ type: 'valider', now: Date.now() })
  }
  const suivant = () => (dernierExercice ? onTerminer() : onAction({ type: 'suivant' }))

  return (
    <div className={`seance${lecture ? ' seance--video' : ''}`}>
      <MediaExercice
        exercice={exercice}
        position={seance.index + 1}
        total={seance.exercices.length}
        lecture={lecture}
        onLire={() => setLecture(true)}
        onArreter={() => setLecture(false)}
        onFermer={onFermer}
        onListe={() => setListe(true)}
      />
      <div className="seance__feuille" ref={feuille}>
        <h1 className="seance__nom">{exercice.nom}</h1>
        <p className="seance__consigne">
          {enCours.series.length} séries × {repsFr(enCours.reps)} reps · repos {reposFr(enCours.reposSec)}
        </p>
        <TuilesPerf exercice={exercice} derniere={derniere} suggestion={suggestion} decouverte={seance.decouverte} />
        <Series
          exercice={exercice}
          enCours={enCours}
          onDefinir={definir}
          onValider={valider}
          onRouvrir={(serie) => onAction({ type: 'rouvrir', serie })}
        />
        <Technique key={exercice.id} exercice={exercice} />
      </div>
      <BarreAction
        reposRestant={reposRestant}
        reposDuree={seance.reposDuree}
        exerciceFini={fini}
        dernierExercice={dernierExercice}
        onAjouterRepos={() => onAction({ type: 'ajouterRepos', now: Date.now(), secondes: SECONDES_AJOUT })}
        onPasserRepos={() => onAction({ type: 'passerRepos' })}
        onSuivant={suivant}
      />
      {liste && (
        <ListeExercices
          seance={seance}
          onFermer={() => setListe(false)}
          onTerminer={() => {
            setListe(false)
            onTerminer()
          }}
          onAller={(index) => {
            setListe(false)
            onAction({ type: 'allerA', index })
          }}
        />
      )}
    </div>
  )
}
