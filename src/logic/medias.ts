import type { DemoExercice } from '../data/types'

const LECTEUR = 'https://www.youtube-nocookie.com/embed/'

/** Lecteur YouTube d'une démo : en boucle, muet (autoplay autorisé sur iPhone), sans contrôles. */
export function urlDemo(demo: DemoExercice): string {
  const parametres = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: demo.youtubeId,
    playsinline: '1',
    controls: '0',
    rel: '0',
  })
  if (demo.debut !== undefined) parametres.set('start', String(demo.debut))
  if (demo.fin !== undefined) parametres.set('end', String(demo.fin))
  return `${LECTEUR}${demo.youtubeId}?${parametres.toString()}`
}

export function miniature(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}
