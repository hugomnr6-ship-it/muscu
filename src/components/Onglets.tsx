import { ChartNoAxesColumn, House, Target } from 'lucide-react'

export type Onglet = 'accueil' | 'progression' | 'cycle'

const ONGLETS = [
  { id: 'accueil', libelle: 'Accueil', Icone: House },
  { id: 'progression', libelle: 'Progression', Icone: ChartNoAxesColumn },
  { id: 'cycle', libelle: 'Mon cycle', Icone: Target },
] as const

interface OngletsProps {
  actif: Onglet
  onChoisir: (onglet: Onglet) => void
}

export function Onglets({ actif, onChoisir }: OngletsProps) {
  return (
    <nav className="onglets" aria-label="Navigation principale">
      {ONGLETS.map(({ id, libelle, Icone }) => (
        <button
          key={id}
          type="button"
          className={`onglet${actif === id ? ' onglet--actif' : ''}`}
          aria-current={actif === id ? 'page' : undefined}
          onClick={() => onChoisir(id)}
        >
          <Icone size={22} strokeWidth={2.2} aria-hidden="true" />
          {libelle}
        </button>
      ))}
    </nav>
  )
}
