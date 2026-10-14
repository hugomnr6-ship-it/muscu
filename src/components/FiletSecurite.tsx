import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CLE } from '../storage/repository'

interface FiletSecuriteProps {
  children: ReactNode
}

interface FiletSecuriteEtat {
  erreur: boolean
}

/** Télécharge les données brutes du téléphone : c'est leur seule copie. */
function telechargerDonneesBrutes(): void {
  let brut = ''
  try {
    brut = window.localStorage.getItem(CLE) ?? ''
  } catch {
    brut = ''
  }
  const url = URL.createObjectURL(new Blob([brut], { type: 'application/json' }))
  const lien = document.createElement('a')
  lien.href = url
  lien.download = 'muscu-donnees-brutes.json'
  lien.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

/** Évite l'écran blanc : en cas de plantage, propose de recharger ou de récupérer les données. */
export class FiletSecurite extends Component<FiletSecuriteProps, FiletSecuriteEtat> {
  state: FiletSecuriteEtat = { erreur: false }

  static getDerivedStateFromError(): FiletSecuriteEtat {
    return { erreur: true }
  }

  componentDidCatch(erreur: Error, info: ErrorInfo): void {
    console.error('Plantage de l’appli', erreur, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.erreur) return this.props.children
    return (
      <div className="ecran">
        <main className="ecran__contenu">
          <h1 className="titre-ecran">Oups</h1>
          <p className="carte carte__texte">
            L’appli a rencontré un problème. Tes données sont toujours sur le téléphone. Recharge l’appli ; si ça
            recommence, télécharge tes données pour ne rien perdre.
          </p>
          <button type="button" className="bouton bouton--principal" onClick={() => window.location.reload()}>
            Recharger
          </button>
          <button type="button" className="bouton" onClick={telechargerDonneesBrutes}>
            Télécharger mes données
          </button>
        </main>
      </div>
    )
  }
}
