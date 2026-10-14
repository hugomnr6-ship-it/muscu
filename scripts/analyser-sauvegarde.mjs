// Résume une sauvegarde exportée depuis l'appli (Mon cycle → Exporter) pour les points d'étape.
// Usage : node scripts/analyser-sauvegarde.mjs chemin/vers/muscu-sauvegarde-AAAA-MM-JJ.json
import { readFileSync } from 'node:fs'

const DEBUT_CYCLE = Date.UTC(2026, 9, 19) // lundi de la semaine 1
const JOUR_MS = 86_400_000
const SEANCES_PREVUES_PAR_SEMAINE = 3

const chemin = process.argv[2]
if (!chemin) {
  console.error('Usage : node scripts/analyser-sauvegarde.mjs <fichier.json>')
  process.exit(1)
}

const contenu = JSON.parse(readFileSync(chemin, 'utf8'))
if (contenu?.app !== 'muscu' || !contenu.donnees) {
  console.error('Ce fichier n’est pas une sauvegarde de l’appli Muscu.')
  process.exit(1)
}

const { historique = [], pesees = [], activites = {} } = contenu.donnees
const enUTC = (iso) => {
  const [a, m, j] = iso.split('-').map(Number)
  return Date.UTC(a, m - 1, j)
}
const semaine = (iso) => {
  const ecart = Math.floor((enUTC(iso) - DEBUT_CYCLE) / JOUR_MS)
  return ecart < 0 ? 0 : Math.floor(ecart / 7) + 1
}
const kg = (n) => `${String(Math.round(n * 100) / 100).replace('.', ',')} kg`

console.log(`Sauvegarde exportée le ${contenu.exporteLe ?? '?'}\n`)

// Assiduité
const seances = [...historique].sort((a, b) => a.fin - b.fin)
const derniere = seances.at(-1)
const semainesEcoulees = derniere ? Math.max(1, semaine(derniere.date)) : 0
console.log('== Assiduité ==')
console.log(`Séances de muscu : ${seances.length} (prévu ≈ ${semainesEcoulees * SEANCES_PREVUES_PAR_SEMAINE} sur ${semainesEcoulees} semaine(s), + la découverte)`)
const parSemaine = new Map()
for (const s of seances) parSemaine.set(semaine(s.date), (parSemaine.get(semaine(s.date)) ?? 0) + 1)
console.log(`Par semaine : ${[...parSemaine].map(([n, c]) => `S${n}=${c}`).join(' · ') || '—'}`)
const sports = Object.values(activites)
console.log(`Tennis : ${sports.filter((x) => x === 'tennis').length} · Padel : ${sports.filter((x) => x === 'padel').length}`)
const durees = seances.map((s) => (s.fin - s.debut) / 60_000).filter((d) => d > 0)
if (durees.length) console.log(`Durée moyenne d’une séance : ${Math.round(durees.reduce((a, b) => a + b, 0) / durees.length)} min`)

// Progression par exercice (charge de référence = la plus lourde, ou l'aide la plus faible pour les tractions)
console.log('\n== Progression par exercice (première → dernière fois) ==')
const parExercice = new Map()
for (const s of seances) {
  for (const e of s.exercices) {
    if (!e.series.length) continue
    const liste = parExercice.get(e.exerciceId) ?? []
    liste.push({ date: s.date, series: e.series })
    parExercice.set(e.exerciceId, liste)
  }
}
for (const [id, fois] of [...parExercice].sort()) {
  const assiste = id === 'tractions-assistees'
  const reference = (series) => (assiste ? Math.min : Math.max)(...series.map((x) => x.kg))
  const premiere = fois[0]
  const recente = fois.at(-1)
  const ecart = reference(recente.series) - reference(premiere.series)
  const sens = assiste ? (ecart < 0 ? 'moins d’aide' : ecart > 0 ? 'plus d’aide' : 'stable') : ecart > 0 ? `+${kg(ecart)}` : ecart < 0 ? kg(ecart) : 'stable'
  const reps = (f) => f.series.map((x) => x.reps).join(',')
  console.log(
    `${id.padEnd(30)} ${fois.length}× · ${kg(reference(premiere.series))} (${reps(premiere)}) → ${kg(reference(recente.series))} (${reps(recente)}) · ${sens}`,
  )
}

// Corps
console.log('\n== Poids et tour de taille ==')
if (!pesees.length) console.log('Aucune pesée enregistrée.')
for (const p of pesees) console.log(`${p.date} (S${semaine(p.date)}) : ${kg(p.poids)} · ${String(p.taille).replace('.', ',')} cm`)
if (pesees.length > 1) {
  const [a, b] = [pesees[0], pesees.at(-1)]
  const semaines = Math.max(1, (enUTC(b.date) - enUTC(a.date)) / (7 * JOUR_MS))
  const parSemainePoids = (b.poids - a.poids) / semaines
  console.log(
    `Évolution : ${parSemainePoids >= 0 ? '+' : ''}${Math.round(parSemainePoids * 1000)} g/semaine (objectif ≈ +250 g) · tour de taille ${b.taille - a.taille >= 0 ? '+' : ''}${String(Math.round((b.taille - a.taille) * 10) / 10).replace('.', ',')} cm en ${Math.round(semaines)} semaines (alerte si > 1 cm/mois)`,
  )
}
