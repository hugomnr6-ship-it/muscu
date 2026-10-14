/** Bip + vibration de fin de repos. L'audio doit être débloqué par un geste (bouton valider). */

let contexte: AudioContext | null = null

export function debloquerSon(): void {
  try {
    contexte ??= new AudioContext()
    if (contexte.state !== 'running') void contexte.resume()
  } catch {
    contexte = null
  }
}

export function signalFinRepos(): void {
  navigator.vibrate?.([200, 100, 200])
  if (!contexte) return
  const debut = contexte.currentTime
  for (const decalage of [0, 0.25]) {
    const oscillateur = contexte.createOscillator()
    const volume = contexte.createGain()
    oscillateur.frequency.value = 880
    volume.gain.setValueAtTime(0.25, debut + decalage)
    volume.gain.exponentialRampToValueAtTime(0.001, debut + decalage + 0.2)
    oscillateur.connect(volume).connect(contexte.destination)
    oscillateur.start(debut + decalage)
    oscillateur.stop(debut + decalage + 0.2)
  }
}
