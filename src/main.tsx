import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource/geist/400.css'
import '@fontsource/geist/500.css'
import '@fontsource/geist/600.css'
import '@fontsource/geist/700.css'
import { App } from './App'
import { FiletSecurite } from './components/FiletSecurite'
import { EXERCICES } from './data/catalogue'
import { miniature } from './logic/medias'
import './styles/tokens.css'
import './styles/base.css'
import './components/composants.css'

const DELAI_PRECHARGEMENT_MS = 4_000

/** Met en cache les miniatures des vidéos pour qu'elles s'affichent aussi sans réseau à la salle. */
function prechargerMiniatures(): void {
  if (!navigator.onLine) return
  for (const exercice of EXERCICES.values()) {
    const apercu = exercice.video?.youtubeId ?? exercice.demo?.youtubeId
    if (!apercu) continue
    const image = new Image()
    image.src = miniature(apercu)
  }
}

registerSW({
  immediate: true,
  onRegisteredSW: () => window.setTimeout(prechargerMiniatures, DELAI_PRECHARGEMENT_MS),
})

const racine = document.getElementById('root')
if (!racine) throw new Error('Élément #root introuvable')

createRoot(racine).render(
  <StrictMode>
    <FiletSecurite>
      <App />
    </FiletSecurite>
  </StrictMode>,
)
