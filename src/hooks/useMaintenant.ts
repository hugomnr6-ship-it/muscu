import { useEffect, useState } from 'react'

/** Horloge qui avance toutes les `intervalle` ms tant que `actif` est vrai. */
export function useMaintenant(actif: boolean, intervalle = 250): number {
  const [maintenant, setMaintenant] = useState(() => Date.now())

  useEffect(() => {
    if (!actif) return
    setMaintenant(Date.now())
    const minuterie = window.setInterval(() => setMaintenant(Date.now()), intervalle)
    return () => window.clearInterval(minuterie)
  }, [actif, intervalle])

  // Au premier rendu d'un nouveau repos, l'état peut dater : on prend l'heure réelle.
  return actif ? Math.max(maintenant, Date.now()) : maintenant
}
