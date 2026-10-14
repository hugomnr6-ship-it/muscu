// Génère les icônes PNG de l'appli (haltère blanc sur fond bleu) sans dépendance externe.
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const BLEU = [0x3b, 0x5b, 0xdb]
const BLANC = [0xff, 0xff, 0xff]
const SUREChANTILLONNAGE = 4

// Rectangles arrondis en coordonnées normalisées : [x1, y1, x2, y2, rayon]
const FORMES = [
  [0.24, 0.47, 0.76, 0.53, 0.02], // barre
  [0.3, 0.32, 0.38, 0.68, 0.035], // disque intérieur gauche
  [0.62, 0.32, 0.7, 0.68, 0.035], // disque intérieur droit
  [0.22, 0.38, 0.29, 0.62, 0.03], // disque extérieur gauche
  [0.71, 0.38, 0.78, 0.62, 0.03], // disque extérieur droit
]

function dansRectArrondi(x, y, [x1, y1, x2, y2, r]) {
  if (x < x1 || x > x2 || y < y1 || y > y2) return false
  const cx = Math.min(Math.max(x, x1 + r), x2 - r)
  const cy = Math.min(Math.max(y, y1 + r), y2 - r)
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

function couverture(px, py, taille) {
  let dedans = 0
  for (let i = 0; i < SUREChANTILLONNAGE; i++) {
    for (let j = 0; j < SUREChANTILLONNAGE; j++) {
      const x = (px + (i + 0.5) / SUREChANTILLONNAGE) / taille
      const y = (py + (j + 0.5) / SUREChANTILLONNAGE) / taille
      if (FORMES.some((f) => dansRectArrondi(x, y, f))) dedans++
    }
  }
  return dedans / SUREChANTILLONNAGE ** 2
}

const TABLE_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(octets) {
  let c = 0xffffffff
  for (const o of octets) c = TABLE_CRC[(c ^ o) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function bloc(type, donnees) {
  const longueur = Buffer.alloc(4)
  longueur.writeUInt32BE(donnees.length)
  const corps = Buffer.concat([Buffer.from(type), donnees])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(corps))
  return Buffer.concat([longueur, corps, crc])
}

function png(taille) {
  const lignes = []
  for (let y = 0; y < taille; y++) {
    const ligne = Buffer.alloc(1 + taille * 3)
    for (let x = 0; x < taille; x++) {
      const a = couverture(x, y, taille)
      for (let c = 0; c < 3; c++) ligne[1 + x * 3 + c] = Math.round(BLEU[c] * (1 - a) + BLANC[c] * a)
    }
    lignes.push(ligne)
  }
  const entete = Buffer.alloc(13)
  entete.writeUInt32BE(taille, 0)
  entete.writeUInt32BE(taille, 4)
  entete[8] = 8 // profondeur
  entete[9] = 2 // RVB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloc('IHDR', entete),
    bloc('IDAT', deflateSync(Buffer.concat(lignes))),
    bloc('IEND', Buffer.alloc(0)),
  ])
}

for (const [fichier, taille] of [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['apple-touch-icon.png', 180],
  ['favicon.png', 64],
]) {
  writeFileSync(new URL(`../public/${fichier}`, import.meta.url), png(taille))
}
