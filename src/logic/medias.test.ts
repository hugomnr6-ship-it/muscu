import { describe, expect, it } from 'vitest'
import { miniature, urlDemo } from './medias'

describe('urlDemo', () => {
  it('lit la démo en boucle, sans le son et sans contrôles', () => {
    const url = new URL(urlDemo({ youtubeId: 'abc123', duree: 20, vertical: true }))
    expect(url.origin + url.pathname).toBe('https://www.youtube-nocookie.com/embed/abc123')
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: 'abc123',
      playsinline: '1',
      controls: '0',
    })
    expect(url.searchParams.has('start')).toBe(false)
  })

  it("ne joue que l'extrait demandé", () => {
    const url = new URL(urlDemo({ youtubeId: 'xyz', duree: 15, vertical: false, debut: 42, fin: 57 }))
    expect(url.searchParams.get('start')).toBe('42')
    expect(url.searchParams.get('end')).toBe('57')
  })
})

describe('miniature', () => {
  it("pointe vers l'image YouTube de la vidéo", () => {
    expect(miniature('abc123')).toBe('https://i.ytimg.com/vi/abc123/hqdefault.jpg')
  })
})
