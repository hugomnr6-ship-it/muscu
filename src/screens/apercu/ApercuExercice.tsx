import { ChevronDown, Play } from 'lucide-react'
import { useId, useState } from 'react'
import { InfosMachine } from '../../components/FicheMachine'
import type { Exercice } from '../../data/types'
import type { ExerciceApercu } from '../../logic/apercu'
import { chargeFr, reposFr, repsFr } from '../../logic/format'
import { miniature, urlDemo } from '../../logic/medias'
import { meilleureCharge } from '../../logic/suggestion'

interface ApercuExerciceProps {
  numero: number
  exercice: Exercice
  apercu: ExerciceApercu
}

function lignePerf(exercice: Exercice, apercu: ExerciceApercu): string {
  const { derniere, suggestion } = apercu
  if (!derniere || suggestion.kg === null) return 'Première fois : commence léger'
  const avant = `${chargeFr(meilleureCharge(derniere.series, exercice.typeCharge), exercice.typeCharge)} × ${derniere.series.map((s) => s.reps).join(', ')}`
  return `Dernière fois ${avant} · essaie ${chargeFr(suggestion.kg, exercice.typeCharge)}`
}

export function ApercuExercice({ numero, exercice, apercu }: ApercuExerciceProps) {
  const [ouvert, setOuvert] = useState(false)
  const [demo, setDemo] = useState(false)
  const idDetail = useId()
  const apercuImage = exercice.video?.youtubeId ?? exercice.demo?.youtubeId

  return (
    <li className={`apercu-exo${ouvert ? ' apercu-exo--ouvert' : ''}`}>
      <button
        type="button"
        className="apercu-exo__entete"
        aria-expanded={ouvert}
        aria-controls={idDetail}
        onClick={() => setOuvert((o) => !o)}
      >
        <span className="apercu-exo__vignette" aria-hidden="true">
          {apercuImage && <img src={miniature(apercuImage)} alt="" width={96} height={72} loading="lazy" />}
          <span className="apercu-exo__numero">{numero}</span>
        </span>
        <span className="apercu-exo__texte">
          <span className="apercu-exo__nom">{exercice.nom}</span>
          <span className="apercu-exo__consigne">
            {apercu.series} × {repsFr(apercu.reps)} reps · repos {reposFr(apercu.reposSec)}
          </span>
          <span className="apercu-exo__perf">{lignePerf(exercice, apercu)}</span>
        </span>
        <ChevronDown className="apercu-exo__chevron" size={20} aria-hidden="true" />
      </button>
      {ouvert && (
        <div id={idDetail} className="apercu-exo__detail">
          {exercice.demo &&
            (demo ? (
              <iframe
                className="apercu-exo__video"
                src={urlDemo(exercice.demo)}
                title={`Démo : ${exercice.nom}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button type="button" className="apercu-exo__voir" onClick={() => setDemo(true)}>
                <Play size={18} fill="currentColor" aria-hidden="true" /> Voir la démo ({exercice.demo.duree} s)
              </button>
            ))}
          {exercice.machine && (
            <div className="apercu-exo__machine">
              <p className="apercu-exo__machine-nom">
                Écrit sur la machine : <strong>{exercice.machine.nom}</strong>
              </p>
              <InfosMachine exercice={exercice} />
            </div>
          )}
          <ol className="technique__liste apercu-exo__technique">
            {exercice.technique.map((point, i) => (
              <li key={i}>
                <span className="technique__numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </li>
  )
}
