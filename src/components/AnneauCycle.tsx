interface AnneauCycleProps {
  semaine: number
  total: number
}

export function AnneauCycle({ semaine, total }: AnneauCycleProps) {
  const pourcent = Math.min(100, Math.round((semaine / total) * 100))
  return (
    <span
      className="anneau"
      style={{ background: `conic-gradient(var(--bleu) 0 ${pourcent}%, var(--bleu-pale) 0)` }}
      aria-hidden="true"
    >
      <span className="anneau__centre">
        {semaine}/{total}
      </span>
    </span>
  )
}
