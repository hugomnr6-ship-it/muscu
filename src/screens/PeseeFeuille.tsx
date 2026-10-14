import { useState } from 'react'
import { Feuille } from '../components/Feuille'
import { Stepper } from '../components/Stepper'
import type { Pesee } from '../data/types'

const POIDS_DEFAUT = 70
const TAILLE_DEFAUT = 80

interface PeseeFeuilleProps {
  aujourdhui: string
  pesees: readonly Pesee[]
  onEnregistrer: (pesee: Pesee) => void
  onFermer: () => void
}

export function PeseeFeuille({ aujourdhui, pesees, onEnregistrer, onFermer }: PeseeFeuilleProps) {
  const derniere = pesees[pesees.length - 1]
  const [poids, setPoids] = useState(derniere?.poids ?? POIDS_DEFAUT)
  const [taille, setTaille] = useState(derniere?.taille ?? TAILLE_DEFAUT)
  const valide = poids > 0 && taille > 0

  return (
    <Feuille titre="Pesée de la semaine" onFermer={onFermer}>
      <p className="texte-2 feuille__intro">
        Le matin, à jeun, après être allé aux toilettes. Tour de taille au niveau du nombril, ventre relâché.
      </p>
      <div className="champ" role="group" aria-labelledby="libelle-poids">
        <span id="libelle-poids" className="champ__libelle">
          Poids (kg)
        </span>
        <Stepper grand valeur={poids} pas={0.1} libelle="poids en kilos" onChanger={setPoids} />
      </div>
      <div className="champ" role="group" aria-labelledby="libelle-taille">
        <span id="libelle-taille" className="champ__libelle">
          Tour de taille (cm)
        </span>
        <Stepper grand valeur={taille} pas={0.5} libelle="tour de taille en centimètres" onChanger={setTaille} />
      </div>
      {!valide && (
        <p className="champ__erreur" role="alert">
          Indique un poids et un tour de taille.
        </p>
      )}
      <button
        type="button"
        className="bouton bouton--bleu"
        onClick={() => valide && onEnregistrer({ date: aujourdhui, poids, taille })}
      >
        Enregistrer
      </button>
    </Feuille>
  )
}
