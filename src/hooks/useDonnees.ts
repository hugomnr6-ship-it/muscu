import { useCallback, useEffect, useRef, useState } from 'react'
import type { Donnees } from '../data/types'
import { charger, donneesVides, sauvegarder } from '../storage/repository'

function chargerSansPlanter(): Donnees {
  try {
    return charger(window.localStorage)
  } catch {
    // Stockage inaccessible (navigation privée, quota…) : l'appli démarre quand même.
    return donneesVides()
  }
}

export type MajDonnees = (modifier: (actuelles: Donnees) => Donnees) => void

/** Données de l'appli, relues au lancement et sauvegardées sur le téléphone à chaque changement. */
export function useDonnees(): [Donnees, MajDonnees, string | null] {
  const [donnees, setDonnees] = useState<Donnees>(chargerSansPlanter)
  const [erreur, setErreur] = useState<string | null>(null)
  const premierRendu = useRef(true)

  useEffect(() => {
    // Demande au navigateur de ne pas effacer les données de l'appli.
    void navigator.storage?.persist?.().catch(() => false)
  }, [])

  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false
      return
    }
    try {
      sauvegarder(window.localStorage, donnees)
      setErreur(null)
    } catch {
      setErreur('Impossible d’enregistrer sur ce téléphone. Exporte une sauvegarde depuis « Mon cycle ».')
    }
  }, [donnees])

  const maj = useCallback<MajDonnees>((modifier) => setDonnees((actuelles) => modifier(actuelles)), [])
  return [donnees, maj, erreur]
}
