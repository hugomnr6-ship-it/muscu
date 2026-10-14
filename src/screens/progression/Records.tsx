import { useState } from 'react'
import { EXERCICES } from '../../data/catalogue'
import type { SeanceFaite } from '../../data/types'
import { ecartJours } from '../../logic/dates'
import { chargeFr } from '../../logic/format'
import { calculerRecords } from '../../logic/records'

const NOMBRE_AFFICHE = 6
const JOURS_NOUVEAU = 7

interface RecordsProps {
  aujourdhui: string
  historique: readonly SeanceFaite[]
}

export function Records({ aujourdhui, historique }: RecordsProps) {
  const [tous, setTous] = useState(false)
  const tries = [...calculerRecords(historique)].sort(([, a], [, b]) => b.date.localeCompare(a.date))
  const liste = tous ? tries : tries.slice(0, NOMBRE_AFFICHE)

  return (
    <section className="carte records" aria-labelledby="titre-records">
      <h2 id="titre-records" className="carte__titre">
        Records
      </h2>
      {liste.length === 0 ? (
        <p className="texte-2 carte__texte">Tes records apparaîtront ici après ta première séance.</p>
      ) : (
        liste.map(([id, record]) => {
          const ex = EXERCICES.get(id)
          if (!ex) return null
          const recent = ecartJours(record.date, aujourdhui) < JOURS_NOUVEAU
          return (
            <div key={id} className="ligne-liste">
              <span className="point" />
              <span className="ligne-liste__nom">
                {ex.court}
                {recent && <span className="badge-nouveau">Nouveau</span>}
              </span>
              <span className="ligne-liste__valeur">
                {chargeFr(record.kg, ex.typeCharge)} × {record.reps}
              </span>
            </div>
          )
        })
      )}
      {tries.length > NOMBRE_AFFICHE && (
        <button type="button" className="ligne-bouton" onClick={() => setTous((t) => !t)}>
          {tous ? 'Voir moins' : `Voir les ${tries.length} records`}
        </button>
      )}
    </section>
  )
}
