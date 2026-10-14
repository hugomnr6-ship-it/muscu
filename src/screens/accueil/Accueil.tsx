import { Dumbbell } from 'lucide-react'
import { useState } from 'react'
import type { Donnees, SeanceId, SportRaquette } from '../../data/types'
import { dateLongue } from '../../logic/format'
import { doitRappelerPesee, estJourPhotos } from '../../logic/pesee'
import { CarteAVenir } from './CarteAVenir'
import { CarteCycle } from './CarteCycle'
import { ChoixSeance } from './ChoixSeance'
import { HeroDuJour } from './HeroDuJour'
import { RappelPesee } from './RappelPesee'
import { SemaineActivites } from './SemaineActivites'
import './accueil.css'

interface AccueilProps {
  aujourdhui: string
  donnees: Donnees
  onCommencer: (seanceId: SeanceId, decouverte: boolean) => void
  onReprendre: () => void
  onTerminerEnCours: () => void
  onAbandonner: () => void
  onPesee: () => void
  onBasculerSport: (date: string, sport: SportRaquette) => void
  onOuvrirCycle: () => void
}

export function Accueil(props: AccueilProps) {
  const { aujourdhui, donnees, onCommencer, onPesee, onBasculerSport, onOuvrirCycle } = props
  const [choix, setChoix] = useState(false)

  return (
    <>
      <header className="accueil__entete">
        <div>
          <div className="accueil__date">{dateLongue(aujourdhui)}</div>
          <h1 className="accueil__titre">Aujourd’hui</h1>
        </div>
        <span className="avatar" aria-hidden="true">
          <Dumbbell size={22} />
        </span>
      </header>

      {doitRappelerPesee(donnees.pesees, aujourdhui) && (
        <RappelPesee photos={estJourPhotos(aujourdhui)} onOuvrir={onPesee} />
      )}

      <HeroDuJour
        aujourdhui={aujourdhui}
        donnees={donnees}
        onCommencer={onCommencer}
        onReprendre={props.onReprendre}
        onTerminerEnCours={props.onTerminerEnCours}
        onAbandonner={props.onAbandonner}
        onChoisirSeance={() => setChoix(true)}
        onBasculerSport={onBasculerSport}
      />

      <SemaineActivites
        aujourdhui={aujourdhui}
        historique={donnees.historique}
        activites={donnees.activites}
        onBasculerSport={onBasculerSport}
      />

      <CarteAVenir aujourdhui={aujourdhui} onOuvrirCalendrier={onOuvrirCycle} />

      <CarteCycle aujourdhui={aujourdhui} onOuvrir={onOuvrirCycle} />

      {choix && (
        <ChoixSeance
          onFermer={() => setChoix(false)}
          onChoisir={(seanceId) => {
            setChoix(false)
            onCommencer(seanceId, false)
          }}
        />
      )}
    </>
  )
}
