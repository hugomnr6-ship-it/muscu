import { useCallback, useState } from 'react'
import { Onglets, type Onglet } from './components/Onglets'
import { SEANCES } from './data/programme'
import type { Donnees, Pesee, SeanceFaite, SeanceId, SportRaquette } from './data/types'
import { dateSimulee, useAujourdhui } from './hooks/useAujourdhui'
import { useDonnees } from './hooks/useDonnees'
import type { RefSeance } from './logic/agenda'
import { infoCycle } from './logic/cycle'
import { dateLongue } from './logic/format'
import { enregistrerPesee } from './logic/pesee'
import { nouveauxRecords, premieresFois } from './logic/records'
import { creerSeance, reducteurSeance, terminerSeance, type ActionSeance } from './logic/seance'
import { Accueil } from './screens/accueil/Accueil'
import { ApercuSeance } from './screens/apercu/ApercuSeance'
import { MonCycle } from './screens/cycle/MonCycle'
import { FinSeance } from './screens/FinSeance'
import { PeseeFeuille } from './screens/PeseeFeuille'
import { Progression } from './screens/progression/Progression'
import { Seance } from './screens/seance/Seance'

interface Bilan {
  seance: SeanceFaite
  historiqueApres: SeanceFaite[]
  nouveaux: string[]
  premieres: string[]
}

function basculer(activites: Readonly<Record<string, SportRaquette>>, date: string, sport: SportRaquette) {
  if (activites[date] === sport) return Object.fromEntries(Object.entries(activites).filter(([d]) => d !== date))
  return { ...activites, [date]: sport }
}

export function App() {
  const [donnees, maj, erreurStockage] = useDonnees()
  const aujourdhui = useAujourdhui()
  const [onglet, setOnglet] = useState<Onglet>('accueil')
  // iOS ferme souvent l'appli en arrière-plan entre deux séries : on rouvre directement la séance du jour.
  const [seanceOuverte, setSeanceOuverte] = useState(() => donnees.seanceEnCours?.date === aujourdhui)
  const [bilan, setBilan] = useState<Bilan | null>(null)
  const [pesee, setPesee] = useState(false)
  const [apercu, setApercu] = useState<RefSeance | null>(null)

  const commencer = (seanceId: SeanceId, decouverte: boolean) => {
    maj((d) => {
      if (d.seanceEnCours) return d
      const allegee = !decouverte && infoCycle(aujourdhui).allegee
      const seanceEnCours = creerSeance(SEANCES[seanceId], d.historique, { date: aujourdhui, now: Date.now(), decouverte, allegee })
      return { ...d, seanceEnCours }
    })
    setSeanceOuverte(true)
  }

  const agir = useCallback(
    (action: ActionSeance) =>
      maj((d) => (d.seanceEnCours ? { ...d, seanceEnCours: reducteurSeance(d.seanceEnCours, action) } : d)),
    [maj],
  )

  const terminer = () => {
    const enCours = donnees.seanceEnCours
    if (!enCours) return
    const restantes = enCours.exercices.some((e) => e.series.some((s) => !s.faite))
    const faite = terminerSeance(enCours, Date.now())
    const vide = faite.exercices.length === 0
    const question = vide
      ? 'Aucune série validée : abandonner cette séance ?'
      : 'Terminer la séance ? Les séries non validées ne seront pas enregistrées.'
    if ((vide || restantes) && !window.confirm(question)) return

    const historiqueApres = vide ? donnees.historique : [...donnees.historique, faite]
    maj((d) => ({ ...d, seanceEnCours: null, historique: vide ? d.historique : [...d.historique, faite] }))
    setSeanceOuverte(false)
    if (!vide) {
      setBilan({
        seance: faite,
        historiqueApres,
        nouveaux: nouveauxRecords(donnees.historique, faite),
        premieres: premieresFois(donnees.historique, faite),
      })
    }
  }

  const abandonner = () => {
    if (!window.confirm('Abandonner cette séance ? Les séries validées ne seront pas enregistrées.')) return
    maj((d) => ({ ...d, seanceEnCours: null }))
  }

  const enregistrer = (nouvelle: Pesee) => {
    maj((d) => ({ ...d, pesees: enregistrerPesee(d.pesees, nouvelle) }))
    setPesee(false)
  }

  const basculerSport = (date: string, sport: SportRaquette) =>
    maj((d) => ({ ...d, activites: basculer(d.activites, date, sport) }))

  const importer = (nouvelles: Donnees) => maj(() => nouvelles)

  if (bilan) {
    return (
      <FinSeance
        seance={bilan.seance}
        historique={bilan.historiqueApres}
        nouveaux={bilan.nouveaux}
        premieres={bilan.premieres}
        onTerminer={() => {
          setBilan(null)
          setOnglet('accueil')
        }}
      />
    )
  }

  if (seanceOuverte && donnees.seanceEnCours) {
    return (
      <Seance
        seance={donnees.seanceEnCours}
        historique={donnees.historique}
        onAction={agir}
        onFermer={() => setSeanceOuverte(false)}
        onTerminer={terminer}
      />
    )
  }

  return (
    <div className="ecran">
      <main className="ecran__contenu" key={onglet}>
        {dateSimulee() && (
          <p className="alerte alerte--info" role="status">
            Date simulée : {dateLongue(aujourdhui)}. Les données saisies sont bien enregistrées.
          </p>
        )}
        {erreurStockage && (
          <p className="alerte" role="alert">
            {erreurStockage}
          </p>
        )}
        {onglet === 'accueil' && (
          <Accueil
            aujourdhui={aujourdhui}
            donnees={donnees}
            onCommencer={commencer}
            onReprendre={() => setSeanceOuverte(true)}
            onTerminerEnCours={terminer}
            onAbandonner={abandonner}
            onPesee={() => setPesee(true)}
            onBasculerSport={basculerSport}
            onOuvrirCycle={() => setOnglet('cycle')}
            onApercu={setApercu}
          />
        )}
        {onglet === 'progression' && (
          <Progression aujourdhui={aujourdhui} donnees={donnees} onPesee={() => setPesee(true)} />
        )}
        {onglet === 'cycle' && (
          <MonCycle aujourdhui={aujourdhui} donnees={donnees} onImporter={importer} onApercu={setApercu} />
        )}
      </main>
      <Onglets actif={onglet} onChoisir={setOnglet} />
      {apercu && (
        <ApercuSeance
          choix={apercu}
          historique={donnees.historique}
          onFermer={() => setApercu(null)}
          onCommencer={
            donnees.seanceEnCours
              ? undefined
              : () => {
                  setApercu(null)
                  commencer(apercu.seanceId, apercu.decouverte)
                }
          }
        />
      )}
      {pesee && (
        <PeseeFeuille
          aujourdhui={aujourdhui}
          pesees={donnees.pesees}
          onEnregistrer={enregistrer}
          onFermer={() => setPesee(false)}
        />
      )}
    </div>
  )
}
