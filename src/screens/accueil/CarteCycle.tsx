import { AnneauCycle } from '../../components/AnneauCycle'
import { Frise } from '../../components/Frise'
import { CYCLE } from '../../data/cycle'
import { infoCycle, type InfoCycle } from '../../logic/cycle'

function texteEtape(info: InfoCycle): string {
  if (info.termine) return 'Cycle terminé : place au bilan'
  if (info.allegee) return 'Semaine légère : une série de moins'
  const etape = info.prochaineEtape
  if (!etape) return ''
  const nom = etape.type === 'point' ? 'Point d’étape' : 'Bilan'
  if (etape.dans === 0) return `${nom} cette semaine`
  if (etape.dans === 1) return `${nom} la semaine prochaine`
  return `${nom} dans ${etape.dans} semaines`
}

interface CarteCycleProps {
  aujourdhui: string
  onOuvrir: () => void
}

export function CarteCycle({ aujourdhui, onOuvrir }: CarteCycleProps) {
  const info = infoCycle(aujourdhui)
  const semaine = Math.min(info.semaine, CYCLE.semaines)
  const titre = info.semaine === 0 ? 'Semaine découverte' : `Semaine ${semaine} sur ${CYCLE.semaines}`
  return (
    <button type="button" className="carte carte-cycle" onClick={onOuvrir} aria-label={`${titre}. ${texteEtape(info)}. Voir mon cycle`}>
      <span className="carte-cycle__haut">
        <AnneauCycle semaine={semaine} total={CYCLE.semaines} />
        <span>
          <span className="carte-cycle__titre">{titre}</span>
          <span className="carte-cycle__texte">{texteEtape(info)}</span>
        </span>
      </span>
      <Frise semaine={semaine} />
    </button>
  )
}
