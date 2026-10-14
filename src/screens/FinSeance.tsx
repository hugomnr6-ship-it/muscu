import { Trophy } from 'lucide-react'
import { EXERCICES } from '../data/catalogue'
import { SEANCES } from '../data/programme'
import type { SeanceFaite } from '../data/types'
import { calculerRecords } from '../logic/records'
import { chargeFr, dureeFr } from '../logic/format'

interface FinSeanceProps {
  seance: SeanceFaite
  historique: readonly SeanceFaite[]
  nouveaux: readonly string[]
  premieres: readonly string[]
  onTerminer: () => void
}

export function FinSeance({ seance, historique, nouveaux, premieres, onTerminer }: FinSeanceProps) {
  const series = seance.exercices.reduce((total, e) => total + e.series.length, 0)
  const records = calculerRecords(historique)

  return (
    <div className="ecran">
      <main className="ecran__contenu">
        <div className="fin__icone" aria-hidden="true">
          <Trophy size={30} />
        </div>
        <h1 className="titre-ecran">Séance terminée</h1>
        <p className="texte-2 fin__sous-titre">
          Séance {seance.seanceId} · {SEANCES[seance.seanceId].titre}
        </p>
        <div className="tuiles-3">
          <div className="tuile">
            <div className="tuile__libelle">Durée</div>
            <div className="tuile__valeur">{dureeFr(seance.fin - seance.debut)}</div>
          </div>
          <div className="tuile">
            <div className="tuile__libelle">Exercices</div>
            <div className="tuile__valeur">{seance.exercices.length}</div>
          </div>
          <div className="tuile">
            <div className="tuile__libelle">Séries</div>
            <div className="tuile__valeur">{series}</div>
          </div>
        </div>
        <section className="carte" aria-labelledby="titre-records">
          <h2 id="titre-records" className="carte__titre">
            Records battus
          </h2>
          {nouveaux.length > 0 ? (
            nouveaux.map((id) => {
              const record = records.get(id)
              const ex = EXERCICES.get(id)
              if (!ex) return null
              return (
                <div key={id} className="ligne-liste">
                  <span className="point" />
                  <span className="ligne-liste__nom">
                    {ex.court}
                    <span className="badge-nouveau">Nouveau</span>
                  </span>
                  {record && (
                    <span className="ligne-liste__valeur">
                      {chargeFr(record.kg, ex.typeCharge)} × {record.reps}
                    </span>
                  )}
                </div>
              )
            })
          ) : (
            <p className="texte-2 carte__texte">
              {premieres.length > 0
                ? 'Tes premières perfs sont enregistrées. La prochaine fois, l’appli te dira quoi battre.'
                : 'Pas de record aujourd’hui, c’est normal : la régularité paie.'}
            </p>
          )}
        </section>
      </main>
      <div className="barre-action">
        <button type="button" className="bouton bouton--principal" onClick={onTerminer}>
          Terminer
        </button>
      </div>
    </div>
  )
}
