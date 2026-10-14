interface MiniBarresProps {
  valeurs: readonly number[]
}

/** Histogramme des 3 dernières mesures (hauteurs relatives, la dernière en bleu). */
export function MiniBarres({ valeurs }: MiniBarresProps) {
  const max = Math.max(...valeurs)
  const min = Math.min(...valeurs)
  const etendue = max - min || 1
  return (
    <span className="mini-barres" aria-hidden="true">
      {valeurs.map((valeur, i) => (
        <span key={i} style={{ height: `${12 + ((valeur - min) / etendue) * 14}px` }} />
      ))}
    </span>
  )
}
