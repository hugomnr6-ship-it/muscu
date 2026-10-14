import { HeartPulse, Pizza, Shield, Sparkles, SquarePlus, Utensils, Watch, type LucideIcon } from 'lucide-react'
import { CONSEILS, type IconeConseil } from '../../data/conseils'
import type { Donnees } from '../../data/types'
import { FriseCycle } from './FriseCycle'
import { Sauvegarde } from './Sauvegarde'
import './cycle.css'

const ICONES: Readonly<Record<IconeConseil, LucideIcon>> = {
  nutrition: Utensils,
  proteines: Sparkles,
  montre: Watch,
  epaule: Shield,
  plaisir: Pizza,
  raquette: HeartPulse,
  suite: SquarePlus,
}

function estInstallee(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

interface MonCycleProps {
  aujourdhui: string
  donnees: Donnees
  onImporter: (donnees: Donnees) => void
}

export function MonCycle({ aujourdhui, donnees, onImporter }: MonCycleProps) {
  return (
    <>
      <h1 className="titre-ecran">Mon cycle</h1>

      {!estInstallee() && (
        <section className="carte carte--accent" aria-labelledby="titre-installer">
          <h2 id="titre-installer" className="carte__titre">
            Mets l’appli sur ton écran d’accueil
          </h2>
          <p className="texte-2 carte__texte">
            Dans Safari : touche Partager, puis « Sur l’écran d’accueil ». Elle s’ouvrira en plein écran et marchera sans
            réseau.
          </p>
        </section>
      )}

      <FriseCycle aujourdhui={aujourdhui} />

      <h2 className="titre-section">Conseils</h2>
      {CONSEILS.map((conseil) => {
        const Icone = ICONES[conseil.icone]
        return (
          <section key={conseil.id} className="carte conseil" aria-labelledby={`conseil-${conseil.id}`}>
            <div className="conseil__entete">
              <span className="conseil__icone" aria-hidden="true">
                <Icone size={20} />
              </span>
              <h3 id={`conseil-${conseil.id}`} className="carte__titre">
                {conseil.titre}
              </h3>
            </div>
            <ul className="conseil__liste">
              {conseil.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        )
      })}

      <Sauvegarde donnees={donnees} aujourdhui={aujourdhui} onImporter={onImporter} />
    </>
  )
}
