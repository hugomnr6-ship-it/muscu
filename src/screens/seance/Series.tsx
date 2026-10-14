import { Check } from 'lucide-react'
import { Stepper } from '../../components/Stepper'
import type { Exercice, ExerciceEnCours } from '../../data/types'
import { nombreFr } from '../../logic/format'
import type { ChampSerie } from '../../logic/seance'
import { serieCourante } from '../../logic/seance'

interface SeriesProps {
  exercice: Exercice
  enCours: ExerciceEnCours
  onDefinir: (champ: ChampSerie, valeur: number) => void
  onValider: () => void
  /** Rouvre une série validée par erreur pour la corriger. */
  onRouvrir: (serie: number) => void
}

const COLONNE_KG: Readonly<Record<Exercice['typeCharge'], string>> = {
  charge: 'kg',
  assistance: 'aide (kg)',
  poidsDuCorps: 'lest (kg)',
}

export function Series({ exercice, enCours, onDefinir, onValider, onRouvrir }: SeriesProps) {
  const courante = serieCourante(enCours)
  const faites = enCours.series.filter((serie) => serie.faite).length
  const total = enCours.series.length
  const kgTexte = (kg: number) => (kg === 0 && exercice.typeCharge === 'poidsDuCorps' ? 'PDC' : nombreFr(kg))

  return (
    <section aria-labelledby="titre-series">
      <div className="series__entete">
        <h2 id="titre-series" className="carte__titre">
          Séries
        </h2>
        <span className="compteur">
          {faites} / {total}
        </span>
      </div>
      <div className="series__colonnes" aria-hidden="true">
        <span />
        <span>{COLONNE_KG[exercice.typeCharge]}</span>
        <span>reps</span>
        <span />
      </div>
      <div className="series__liste">
        {enCours.series.map((serie, i) => {
          if (serie.faite) {
            return (
              <button
                key={i}
                type="button"
                className="serie serie--faite"
                onClick={() => onRouvrir(i)}
                aria-label={`Série ${i + 1} faite : ${kgTexte(serie.kg)}, ${serie.reps} reps. Toucher pour corriger`}
              >
                <span className="serie__numero">{i + 1}</span>
                <span className="serie__valeur">{kgTexte(serie.kg)}</span>
                <span className="serie__valeur">{serie.reps}</span>
                <span className="serie__coche" aria-hidden="true">
                  <Check size={20} strokeWidth={3} />
                </span>
              </button>
            )
          }
          if (i === courante) {
            return (
              <div key={i} className="serie serie--courante">
                <span className="serie__numero">{i + 1}</span>
                <Stepper
                  valeur={serie.kg}
                  pas={exercice.pasKg}
                  libelle={`charge de la série ${i + 1}`}
                  texteZero={exercice.typeCharge === 'poidsDuCorps' ? 'PDC' : undefined}
                  onChanger={(valeur) => onDefinir('kg', valeur)}
                />
                <Stepper
                  valeur={serie.reps}
                  pas={1}
                  libelle={`répétitions de la série ${i + 1}`}
                  onChanger={(valeur) => onDefinir('reps', Math.round(valeur))}
                />
                <button type="button" className="serie__valider" onClick={onValider} aria-label={`Valider la série ${i + 1}`}>
                  <Check size={22} strokeWidth={3} aria-hidden="true" />
                </button>
              </div>
            )
          }
          return (
            <div key={i} className="serie serie--a-venir">
              <span className="sr-only">Série {i + 1} à venir</span>
              <span className="serie__numero" aria-hidden="true">
                {i + 1}
              </span>
              <span className="serie__valeur">{kgTexte(serie.kg)}</span>
              <span className="serie__valeur">—</span>
              <span className="serie__vide" aria-hidden="true" />
            </div>
          )
        })}
        {courante === -1 && (
          <div className="bravo" role="status">
            Les {total} séries sont faites. Bien joué ! Une erreur ? Touche une série pour la corriger.
          </div>
        )}
      </div>
    </section>
  )
}
