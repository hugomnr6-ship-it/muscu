import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Courbe } from '../../components/Courbe'
import { Feuille } from '../../components/Feuille'
import { EXERCICES, exercice as trouverExercice } from '../../data/catalogue'
import { EXERCICES_PHARES } from '../../data/programme'
import type { Donnees } from '../../data/types'
import { chargeFr, nombreFr } from '../../logic/format'
import { pointsProgression } from '../../logic/progression'
import { Records } from './Records'
import { TuilesCorps } from './TuilesCorps'
import './progression.css'

interface ProgressionProps {
  aujourdhui: string
  donnees: Donnees
  onPesee: () => void
}

function libelleSemaine(semaine: number): string {
  return semaine === 0 ? 'Découv.' : `Sem. ${semaine}`
}

export function Progression({ aujourdhui, donnees, onPesee }: ProgressionProps) {
  const [exerciceId, setExerciceId] = useState<string>(EXERCICES_PHARES[0])
  const [choix, setChoix] = useState(false)
  const exercice = trouverExercice(exerciceId)
  const points = pointsProgression(donnees.historique, exerciceId, exercice.typeCharge)
  const valeurs = points.map((p) => p.kg)
  const gain = valeurs.length > 1 ? valeurs[valeurs.length - 1] - valeurs[0] : 0
  const progres = exercice.typeCharge === 'assistance' ? -gain : gain
  const libelles =
    points.length > 1
      ? [points[0], points[Math.floor((points.length - 1) / 2)], points[points.length - 1]].map((p) => libelleSemaine(p.semaine))
      : []
  const faits = new Set(donnees.historique.flatMap((s) => s.exercices.map((e) => e.exerciceId)))

  return (
    <>
      <h1 className="titre-ecran">Progression</h1>

      <div className="segmente" role="group" aria-label="Exercice affiché">
        {EXERCICES_PHARES.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === exerciceId}
            className={`segmente__option${id === exerciceId ? ' segmente__option--actif' : ''}`}
            onClick={() => setExerciceId(id)}
          >
            {trouverExercice(id).court}
          </button>
        ))}
      </div>

      <section className="carte" aria-labelledby="titre-courbe">
        <div className="courbe__entete">
          <div>
            <h2 id="titre-courbe" className="courbe__libelle">
              {exercice.court} · {exercice.typeCharge === 'assistance' ? 'aide la plus faible' : 'charge max'}
            </h2>
            <div className="courbe__valeur">
              {valeurs.length > 0 ? chargeFr(valeurs[valeurs.length - 1], exercice.typeCharge) : '—'}
            </div>
          </div>
          {progres > 0 && (
            <span className="pill pill--vert">
              ↑ {exercice.typeCharge === 'assistance' ? '−' : '+'}
              {nombreFr(Math.abs(gain))} kg
            </span>
          )}
        </div>
        {valeurs.length > 0 ? (
          <Courbe
            valeurs={valeurs}
            libelles={libelles}
            description={`Évolution de ${exercice.nom} : ${valeurs.map(nombreFr).join(', ')} kg`}
          />
        ) : (
          <p className="texte-2 carte__texte">Fais cet exercice une première fois pour voir ta courbe.</p>
        )}
        <button type="button" className="ligne-bouton" onClick={() => setChoix(true)}>
          Voir un autre exercice
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </section>

      <Records aujourdhui={aujourdhui} historique={donnees.historique} />
      <TuilesCorps pesees={donnees.pesees} onPesee={onPesee} />

      {choix && (
        <Feuille titre="Choisir un exercice" onFermer={() => setChoix(false)}>
          {[...EXERCICES.values()]
            .sort((a, b) => Number(faits.has(b.id)) - Number(faits.has(a.id)))
            .map((e) => (
              <button
                key={e.id}
                type="button"
                className={`liste-exo${e.id === exerciceId ? ' liste-exo--actif' : ''}`}
                onClick={() => {
                  setExerciceId(e.id)
                  setChoix(false)
                }}
              >
                <span className="liste-exo__nom">{e.nom}</span>
                {!faits.has(e.id) && <span className="liste-exo__statut">pas encore fait</span>}
              </button>
            ))}
        </Feuille>
      )}
    </>
  )
}
