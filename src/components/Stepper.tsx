import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { nombreFr } from '../logic/format'

interface StepperProps {
  valeur: number
  pas: number
  libelle: string
  onChanger: (valeur: number) => void
  grand?: boolean
  /** Texte affiché à la place de 0 (ex. « PDC »). */
  texteZero?: string
}

/** Pastille − valeur + ; la valeur se tape aussi au clavier. */
export function Stepper({ valeur, pas, libelle, onChanger, grand = false, texteZero }: StepperProps) {
  const [saisie, setSaisie] = useState<string | null>(null)
  const affichee = valeur === 0 && texteZero ? texteZero : nombreFr(valeur)

  useEffect(() => setSaisie(null), [valeur])

  const valider = () => {
    if (saisie === null) return
    const nombre = Number(saisie.replace(',', '.').trim())
    if (saisie.trim() !== '' && Number.isFinite(nombre)) onChanger(Math.max(0, nombre))
    setSaisie(null)
  }

  return (
    <div className={`stepper${grand ? ' stepper--grand' : ''}`}>
      <button
        type="button"
        className="stepper__bouton"
        aria-label={`Moins ${libelle}`}
        onClick={() => onChanger(Math.max(0, Math.round((valeur - pas) * 100) / 100))}
      >
        <Minus size={22} aria-hidden="true" />
      </button>
      <input
        className="stepper__valeur"
        inputMode="decimal"
        aria-label={libelle}
        value={saisie ?? affichee}
        onFocus={(e) => {
          setSaisie(valeur === 0 ? '' : nombreFr(valeur))
          e.currentTarget.select()
        }}
        onChange={(e) => setSaisie(e.target.value)}
        onBlur={valider}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <button
        type="button"
        className="stepper__bouton"
        aria-label={`Plus ${libelle}`}
        onClick={() => onChanger(Math.round((valeur + pas) * 100) / 100)}
      >
        <Plus size={22} aria-hidden="true" />
      </button>
    </div>
  )
}
