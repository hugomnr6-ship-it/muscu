// Construit l'appli pour GitHub Pages (/muscu/) et publie le dossier dist sur la branche gh-pages.
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const racine = fileURLToPath(new URL('..', import.meta.url))
const dist = fileURLToPath(new URL('../dist', import.meta.url))
const DEPOT = 'https://github.com/hugomnr6-ship-it/muscu.git'

function lancer(commande, args, options = {}) {
  // npm est un script .cmd sous Windows : il lui faut un shell ; git non (et le shell couperait le message).
  const shell = commande === 'npm' && process.platform === 'win32'
  execFileSync(commande, args, { stdio: 'inherit', shell, ...options })
}

lancer('npm', ['test'], { cwd: racine })
lancer('npm', ['run', 'build'], { cwd: racine, env: { ...process.env, BASE_PATH: '/muscu/' } })

// Pas de traitement Jekyll : les fichiers sont servis tels quels.
writeFileSync(`${dist}/.nojekyll`, '')
if (existsSync(`${dist}/.git`)) rmSync(`${dist}/.git`, { recursive: true, force: true })

const git = (...args) => lancer('git', args, { cwd: dist })
git('init', '-q', '-b', 'gh-pages')
git('config', 'user.name', 'hugomnr6-ship-it')
git('config', 'user.email', 'hugomnr6-ship-it@users.noreply.github.com')
git('add', '-A')
git('commit', '-q', '-m', `publication ${new Date().toISOString()}`)
git('push', '-f', DEPOT, 'gh-pages')
rmSync(`${dist}/.git`, { recursive: true, force: true })
console.log('Publié : https://hugomnr6-ship-it.github.io/muscu/')
