import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const outputDirectory = 'dist'
const source = join(outputDirectory, 'index.html')
const routes = [
  'about',
  'journey',
  'shelf',
  'shelf/games',
  'shelf/books',
  'shelf/music',
  'shelf/films',
]

await copyFile(source, join(outputDirectory, '404.html'))

for (const route of routes) {
  const routeDirectory = join(outputDirectory, ...route.split('/'))
  await mkdir(routeDirectory, { recursive: true })
  await copyFile(source, join(routeDirectory, 'index.html'))
}
