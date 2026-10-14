import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Donnees } from '../../data/types'
import { exporter, importer } from '../../storage/repository'

const TAILLE_MAX_IMPORT = 5 * 1024 * 1024

interface SauvegardeProps {
  donnees: Donnees
  aujourdhui: string
  onImporter: (donnees: Donnees) => void
}

export function Sauvegarde({ donnees, aujourdhui, onImporter }: SauvegardeProps) {
  const fichier = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null)

  /** Sur iPhone, la feuille de partage (« Enregistrer dans Fichiers ») ; sinon un téléchargement classique. */
  const exporterFichier = async () => {
    const nom = `muscu-sauvegarde-${aujourdhui}.json`
    const contenu = exporter(donnees)
    const fichierExport = new File([contenu], nom, { type: 'application/json' })
    if (navigator.canShare?.({ files: [fichierExport] })) {
      try {
        await navigator.share({ files: [fichierExport], title: 'Sauvegarde Muscu' })
        setMessage({ ok: true, texte: 'Sauvegarde partagée. Garde-la dans Fichiers ou iCloud.' })
        return
      } catch (erreur) {
        if (erreur instanceof DOMException && erreur.name === 'AbortError') return
      }
    }
    const url = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }))
    const lien = document.createElement('a')
    lien.href = url
    lien.download = nom
    lien.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
    setMessage({ ok: true, texte: 'Sauvegarde téléchargée : vérifie qu’elle est bien dans tes fichiers.' })
  }

  const lire = async (selection: File | undefined) => {
    if (!selection) return
    if (selection.size > TAILLE_MAX_IMPORT) {
      setMessage({ ok: false, texte: 'Ce fichier est trop gros pour être une sauvegarde.' })
      return
    }
    const resultat = importer(await selection.text())
    if (!resultat.ok) {
      setMessage({ ok: false, texte: resultat.erreur })
      return
    }
    if (!window.confirm('Remplacer toutes les données de l’appli par cette sauvegarde ?')) return
    onImporter(resultat.donnees)
    setMessage({ ok: true, texte: 'Sauvegarde importée.' })
  }

  return (
    <section className="carte" aria-labelledby="titre-sauvegarde">
      <h2 id="titre-sauvegarde" className="carte__titre">
        Sauvegarde
      </h2>
      <p className="texte-2 carte__texte">
        Tes données restent sur ce téléphone. Fais une sauvegarde de temps en temps, par exemple à chaque bilan.
      </p>
      <div className="boutons-2">
        <button type="button" className="bouton" onClick={() => void exporterFichier()}>
          <Download size={20} aria-hidden="true" /> Exporter
        </button>
        <button type="button" className="bouton" onClick={() => fichier.current?.click()}>
          <Upload size={20} aria-hidden="true" /> Importer
        </button>
      </div>
      <input
        ref={fichier}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          void lire(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {message && (
        <p className={message.ok ? 'message message--ok' : 'message message--erreur'} role="status">
          {message.texte}
        </p>
      )}
    </section>
  )
}
