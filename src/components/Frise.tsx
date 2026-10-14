import { CYCLE } from '../data/cycle'

interface FriseProps {
  /** Nombre de semaines terminées ou en cours. */
  semaine: number
}

export function Frise({ semaine }: FriseProps) {
  return (
    <div className="frise" aria-hidden="true">
      {Array.from({ length: CYCLE.semaines }, (_, i) => {
        const numero = i + 1
        const etape = numero === CYCLE.pointEtape || numero === CYCLE.bilan
        const classe = etape ? 'frise__segment--etape' : numero <= semaine ? 'frise__segment--fait' : ''
        return <span key={numero} className={`frise__segment ${classe}`} />
      })}
    </div>
  )
}
