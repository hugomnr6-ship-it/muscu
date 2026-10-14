import { Scale } from 'lucide-react'

interface RappelPeseeProps {
  photos: boolean
  onOuvrir: () => void
}

export function RappelPesee({ photos, onOuvrir }: RappelPeseeProps) {
  return (
    <button type="button" className="rappel" onClick={onOuvrir}>
      <span className="rappel__icone">
        <Scale size={22} aria-hidden="true" />
      </span>
      <span>
        <span className="rappel__titre">C’est le jour de la pesée</span>
        <span className="rappel__texte">
          Le matin, à jeun : poids et tour de taille.
          {photos && ' Prends aussi tes photos (face, profil, dos).'}
        </span>
      </span>
    </button>
  )
}
