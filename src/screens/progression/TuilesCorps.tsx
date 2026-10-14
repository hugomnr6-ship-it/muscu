import { MiniBarres } from '../../components/MiniBarres'
import type { Pesee } from '../../data/types'
import { nombreFr } from '../../logic/format'
import { tendance, type Tendance } from '../../logic/pesee'

/** Au-delà de cette hausse hebdo du tour de taille, on alerte (prise de gras probable). */
const TAILLE_ALERTE_CM = 0.5

interface TuilesCorpsProps {
  pesees: readonly Pesee[]
  onPesee: () => void
}

interface TuileProps {
  libelle: string
  unite: string
  donnees: Tendance | null
  couleurDelta: (delta: number) => string
  onOuvrir: () => void
}

function Tuile({ libelle, unite, donnees, couleurDelta, onOuvrir }: TuileProps) {
  return (
    <button type="button" className="tuile-corps" onClick={onOuvrir} aria-label={`${libelle} : ajouter une pesée`}>
      <span className="tuile__libelle">{libelle}</span>
      <span className="tuile-corps__valeur">{donnees ? `${nombreFr(donnees.derniere)} ${unite}` : '—'}</span>
      <span className="tuile-corps__bas">
        {donnees && donnees.delta !== null ? (
          <span className="tuile-corps__delta" style={{ color: couleurDelta(donnees.delta) }}>
            {donnees.delta === 0
              ? 'Stable'
              : `${donnees.delta > 0 ? '↑' : '↓'} ${nombreFr(Math.abs(donnees.delta))} ${unite}`}
          </span>
        ) : (
          <span className="tuile-corps__delta texte-2">{donnees ? 'Première mesure' : 'Ajouter'}</span>
        )}
        {donnees && donnees.dernieres.length > 1 && <MiniBarres valeurs={donnees.dernieres} />}
      </span>
    </button>
  )
}

export function TuilesCorps({ pesees, onPesee }: TuilesCorpsProps) {
  return (
    <div className="tuiles-corps">
      <Tuile
        libelle="Poids"
        unite="kg"
        donnees={tendance(pesees, 'poids')}
        couleurDelta={(delta) => (delta >= 0 ? 'var(--vert-fonce)' : 'var(--texte-2)')}
        onOuvrir={onPesee}
      />
      <Tuile
        libelle="Tour de taille"
        unite="cm"
        donnees={tendance(pesees, 'taille')}
        couleurDelta={(delta) => (delta > TAILLE_ALERTE_CM ? 'var(--ambre-fonce)' : 'var(--vert-fonce)')}
        onOuvrir={onPesee}
      />
    </div>
  )
}
