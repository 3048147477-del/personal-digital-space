import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const LIBRARY_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'library.json')
const MAX_HTML_LENGTH = 2_500_000
const FETCH_TIMEOUT_MS = 15_000
const BOOK_STATUSES = new Set(['在读', '读完', '想读'])

const usage = `
本地收藏同步

用法：
  npm run content:sync -- <公开链接...>
  npm run content:sync -- --book-status 在读 <微信读书公开分享链接>
  npm run content:sync -- --file <JSON 文件>

选项：
  --dry-run              只预览，不写入
  --yes                  跳过交互确认并写入
  --book-status <状态>   微信读书链接对应的阅读状态：在读、读完、想读
  --file <路径>          导入本地 JSON 文件
  --help                 查看帮助
`.trim()

function requiredText(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`缺少必填字段：${field}`)
  }
  return value.trim()
}

function optionalText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function optionalDate(value, field) {
  const date = optionalText(value)
  if (!date) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${field} 必须使用 YYYY-MM-DD 格式`)
  }
  return date
}

function assertRecord(record, field) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(`${field} 中的每一项都必须是 JSON 对象`)
  }
  return record
}

function normalizeSource(value, allowed, field) {
  if (value === undefined || value === null || value === '') return 'manual'
  const source = requiredText(value, field)
  if (!allowed.includes(source)) throw new Error(`${field} 不支持来源“${source}”`)
  return source
}

function assertPublicAsset(value, field) {
  const asset = requiredText(value, field)
  if (asset.startsWith('/')) return asset

  let url
  try {
    url = new URL(asset)
  } catch {
    throw new Error(`${field} 必须是 http(s) 链接或站内绝对路径`)
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${field} 只接受 http(s) 链接`)
  }
  return url.href.replace(/^http:/, 'https:')
}

function assertExternalUrl(value, field = 'externalUrl') {
  if (value === undefined || value === null || value === '') return undefined
  const raw = requiredText(value, field)
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`${field} 不是有效链接`)
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${field} 只接受 http(s) 链接`)
  }
  return url.href
}

function formatShanghaiDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function shortHash(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}

function decodeHtml(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .trim()
}

function parseAttributes(tag) {
  const attributes = {}
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '')
  }
  return attributes
}

function getMeta(html, key) {
  const normalizedKey = key.toLowerCase()
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0])
    const identity = (attributes.property || attributes.name || '').toLowerCase()
    if (identity === normalizedKey && attributes.content) return attributes.content
  }
  return undefined
}

function getPageTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, '')) : undefined
}

function readJsonString(html, key) {
  const pattern = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, 'i')
  const match = html.match(pattern)
  if (!match) return undefined
  try {
    return JSON.parse(`"${match[1]}"`).trim()
  } catch {
    return decodeHtml(match[1])
  }
}

function effectiveUrl(raw) {
  const url = new URL(raw)
  const route = url.hash.startsWith('#/') ? url.hash.slice(1) : ''
  return route ? new URL(route, url.origin) : url
}

function assertSupportedHost(url) {
  const host = url.hostname.toLowerCase()
  const isNetease = host === 'music.163.com' || host === 'y.music.163.com'
  const isWeread = host === 'weread.qq.com' || host.endsWith('.weread.qq.com')
  if (!isNetease && !isWeread) {
    throw new Error(`不支持的链接来源：${host}`)
  }
  return isNetease ? 'netease' : 'weread'
}

async function fetchPublicHtml(rawUrl, fetchImpl = fetch) {
  const initialUrl = new URL(rawUrl)
  assertSupportedHost(initialUrl)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetchImpl(initialUrl, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; PersonalDigitalSpaceSync/1.0)',
      },
    })
    if (!response.ok) throw new Error(`公开页面请求失败：HTTP ${response.status}`)

    const finalUrl = new URL(response.url || initialUrl.href)
    assertSupportedHost(finalUrl)
    const html = await response.text()
    if (html.length > MAX_HTML_LENGTH) throw new Error('公开页面体积异常，已停止读取')
    return { html, url: finalUrl }
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('公开页面读取超时')
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export function parseNeteaseSongHtml(html, songId, date = formatShanghaiDate()) {
  const pageTitle = getPageTitle(html)
  const title = getMeta(html, 'og:title') || pageTitle?.split(' - ')[0]?.trim()
  const description = getMeta(html, 'og:description') || ''
  const descriptionArtist = description.match(/由\s*(.+?)\s*演唱/)
  const artist = descriptionArtist?.[1]?.trim() || pageTitle?.split(' - ')[1]?.trim()
  const cover = getMeta(html, 'og:image') || getMeta(html, 'twitter:image')

  if (!title || !artist || !cover) {
    throw new Error(`网易云歌曲 ${songId} 的公开页面缺少歌名、歌手或封面，未写入`)
  }

  return {
    id: `netease-song-${songId}`,
    title,
    artist,
    cover: assertPublicAsset(cover, 'cover'),
    kind: '单曲',
    externalUrl: `https://music.163.com/#/song?id=${songId}`,
    source: 'netease',
    sourceId: String(songId),
    addedAt: date,
    updatedAt: date,
  }
}

export function extractNeteaseSongIds(html) {
  const ids = new Set()
  const decoded = decodeHtml(html)
  for (const match of decoded.matchAll(/(?:\/|#\/)?song\?id=(\d+)/gi)) ids.add(match[1])
  return [...ids]
}

function extractWereadBookId(url, html) {
  const queryId = url.searchParams.get('bookId') || url.searchParams.get('bookid')
  if (queryId) return queryId
  const pathId = url.pathname.match(/\/(?:bookDetail|reader|book)\/([^/?#]+)/i)?.[1]
  if (pathId) return pathId
  return readJsonString(html, 'bookId')
}

function stripWereadSuffix(title) {
  return title
    .replace(/\s*[-—|｜]\s*微信读书.*$/i, '')
    .replace(/\s*[-—|｜]\s*WeRead.*$/i, '')
    .trim()
}

export function parseWereadBookHtml(html, pageUrl, status, date = formatShanghaiDate()) {
  if (!BOOK_STATUSES.has(status)) {
    throw new Error('微信读书链接必须明确提供阅读状态：在读、读完或想读')
  }

  const url = new URL(pageUrl)
  const rawTitle = getMeta(html, 'og:title') || getPageTitle(html) || readJsonString(html, 'title')
  const title = rawTitle ? stripWereadSuffix(rawTitle) : undefined
  const description = getMeta(html, 'og:description') || ''
  const author = readJsonString(html, 'author')
    || description.match(/作者[：:]\s*([^，。|｜]+)/)?.[1]?.trim()
  const cover = getMeta(html, 'og:image') || getMeta(html, 'twitter:image') || readJsonString(html, 'cover')
  const sourceId = extractWereadBookId(url, html) || shortHash(url.href)

  if (!title || !author || !cover) {
    throw new Error('微信读书公开页面缺少书名、作者或封面；请改用 JSON 文件导入，未写入')
  }

  return {
    id: `weread-book-${sourceId.replace(/[^a-z0-9_-]/gi, '-')}`,
    title,
    author,
    cover: assertPublicAsset(cover, 'cover'),
    status,
    externalUrl: url.href,
    source: 'weread',
    sourceId,
    addedAt: date,
    updatedAt: date,
  }
}

async function mapWithConcurrency(values, concurrency, task) {
  const results = new Array(values.length)
  let cursor = 0
  async function worker() {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      results[index] = await task(values[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker))
  return results
}

async function collectNetease(url, date, fetchImpl) {
  const route = effectiveUrl(url)
  const page = await fetchPublicHtml(route, fetchImpl)
  const finalRoute = effectiveUrl(page.url)
  const songId = finalRoute.pathname.match(/\/song\/?$/i) ? finalRoute.searchParams.get('id') : null
  if (songId) return { music: [parseNeteaseSongHtml(page.html, songId, date)], books: [], warnings: [] }

  const isPlaylist = /\/playlist\/?$/i.test(finalRoute.pathname)
  if (!isPlaylist) throw new Error('网易云链接需要指向公开单曲或公开歌单')

  const songIds = extractNeteaseSongIds(page.html)
  if (songIds.length === 0) {
    throw new Error('这个公开歌单页面没有暴露曲目列表；请改为逐首粘贴歌曲链接')
  }
  if (songIds.length > 300) throw new Error('歌单超过 300 首，请拆分后再同步')

  const warnings = []
  const tracks = await mapWithConcurrency(songIds, 4, async (id) => {
    try {
      const songPage = await fetchPublicHtml(`https://music.163.com/song?id=${id}`, fetchImpl)
      return parseNeteaseSongHtml(songPage.html, id, date)
    } catch (error) {
      warnings.push(`歌曲 ${id}：${error.message}`)
      return null
    }
  })
  const music = tracks.filter(Boolean)
  if (music.length === 0) throw new Error('歌单中的公开歌曲都无法读取，未写入')
  return { music, books: [], warnings }
}

async function collectFromUrl(rawUrl, options) {
  let url
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error(`不是有效链接：${rawUrl}`)
  }
  const source = assertSupportedHost(url)
  if (source === 'netease') return collectNetease(url, options.date, options.fetchImpl)

  const page = await fetchPublicHtml(url, options.fetchImpl)
  return {
    music: [],
    books: [parseWereadBookHtml(page.html, page.url, options.bookStatus, options.date)],
    warnings: [],
  }
}

export function normalizeMusic(record, date) {
  assertRecord(record, 'music')
  const source = normalizeSource(record.source, ['netease', 'manual'], 'music.source')
  const title = requiredText(record.title, 'music.title')
  const artist = requiredText(record.artist, 'music.artist')
  const kind = requiredText(record.kind, 'music.kind')
  if (!['单曲', '专辑'].includes(kind)) throw new Error('music.kind 只能是“单曲”或“专辑”')
  const externalUrl = assertExternalUrl(record.externalUrl)
  const sourceId = optionalText(record.sourceId)
  return {
    id: optionalText(record.id) || `${source}-music-${sourceId || shortHash(`${title}\0${artist}`)}`,
    title,
    artist,
    cover: assertPublicAsset(record.cover, 'music.cover'),
    kind,
    ...(externalUrl ? { externalUrl } : {}),
    ...(optionalText(record.note) ? { note: optionalText(record.note) } : {}),
    source,
    ...(sourceId ? { sourceId } : {}),
    addedAt: optionalDate(record.addedAt, 'music.addedAt') || date,
    updatedAt: optionalDate(record.updatedAt, 'music.updatedAt') || date,
  }
}

export function normalizeBook(record, date) {
  assertRecord(record, 'books')
  const source = normalizeSource(record.source, ['weread', 'manual'], 'books.source')
  const title = requiredText(record.title, 'books.title')
  const author = requiredText(record.author, 'books.author')
  const status = requiredText(record.status, 'books.status')
  if (!BOOK_STATUSES.has(status)) throw new Error('books.status 只能是“在读”“读完”或“想读”')
  const externalUrl = assertExternalUrl(record.externalUrl)
  const sourceId = optionalText(record.sourceId)
  const finishedAt = optionalDate(record.finishedAt, 'books.finishedAt')
  return {
    id: optionalText(record.id) || `${source}-book-${sourceId || shortHash(`${title}\0${author}`)}`,
    title,
    author,
    cover: assertPublicAsset(record.cover, 'books.cover'),
    status,
    ...(finishedAt ? { finishedAt } : {}),
    ...(externalUrl ? { externalUrl } : {}),
    ...(optionalText(record.note) ? { note: optionalText(record.note) } : {}),
    source,
    ...(sourceId ? { sourceId } : {}),
    addedAt: optionalDate(record.addedAt, 'books.addedAt') || date,
    updatedAt: optionalDate(record.updatedAt, 'books.updatedAt') || date,
  }
}

async function collectFromFile(filePath, date) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  let parsed
  try {
    parsed = JSON.parse(await readFile(absolutePath, 'utf8'))
  } catch (error) {
    throw new Error(`无法读取 JSON 文件：${error.message}`)
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('导入文件必须是包含 books 和/或 music 数组的 JSON 对象')
  }
  const books = parsed.books === undefined ? [] : parsed.books
  const music = parsed.music === undefined ? [] : parsed.music
  if (!Array.isArray(books) || !Array.isArray(music)) {
    throw new Error('books 和 music 必须是数组')
  }
  return {
    books: books.map((record) => normalizeBook(record, date)),
    music: music.map((record) => normalizeMusic(record, date)),
    warnings: [],
  }
}

function normalizeIdentity(value) {
  return String(value || '').normalize('NFKC').trim().toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ')
}

function canonicalExternalUrl(value) {
  if (!value) return ''
  try {
    const url = effectiveUrl(value)
    url.hash = ''
    url.hostname = url.hostname.toLowerCase()
    url.pathname = url.pathname.replace(/\/$/, '')
    url.searchParams.sort()
    return url.href
  } catch {
    return normalizeIdentity(value)
  }
}

export function recordsMatch(kind, left, right) {
  if (left.id && right.id && left.id === right.id) return true
  if (left.source && right.source && left.source === right.source && left.sourceId && right.sourceId) {
    if (String(left.sourceId) === String(right.sourceId)) return true
  }
  const leftUrl = canonicalExternalUrl(left.externalUrl)
  const rightUrl = canonicalExternalUrl(right.externalUrl)
  if (leftUrl && rightUrl && leftUrl === rightUrl) return true
  const counterpart = kind === 'music' ? 'artist' : 'author'
  return normalizeIdentity(left.title) === normalizeIdentity(right.title)
    && normalizeIdentity(left[counterpart]) === normalizeIdentity(right[counterpart])
}

function partitionAdditions(existing, incoming, kind) {
  const additions = []
  const skipped = []
  for (const record of incoming) {
    const duplicate = [...existing, ...additions].find((item) => recordsMatch(kind, item, record))
    if (duplicate) skipped.push({ kind, record, duplicate })
    else additions.push(record)
  }
  return { additions, skipped }
}

function parseArgs(argv) {
  const options = { urls: [], files: [], dryRun: false, yes: false, bookStatus: undefined, help: false }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') options.help = true
    else if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--yes') options.yes = true
    else if (argument === '--file') {
      const value = argv[index + 1]
      if (!value) throw new Error('--file 后需要提供路径')
      options.files.push(value)
      index += 1
    } else if (argument === '--book-status') {
      const value = argv[index + 1]
      if (!value) throw new Error('--book-status 后需要提供状态')
      options.bookStatus = value
      index += 1
    } else if (argument.startsWith('--')) throw new Error(`未知选项：${argument}`)
    else options.urls.push(argument)
  }
  if (options.bookStatus && !BOOK_STATUSES.has(options.bookStatus)) {
    throw new Error('--book-status 只能是“在读”“读完”或“想读”')
  }
  return options
}

function printPreview(additions, skipped, warnings) {
  console.log('\n同步预览')
  for (const item of additions.books) console.log(`  + [书籍] ${item.title} — ${item.author}（${item.status}）`)
  for (const item of additions.music) console.log(`  + [音乐] ${item.title} — ${item.artist}`)
  for (const item of skipped) {
    const person = item.kind === 'music' ? item.record.artist : item.record.author
    console.log(`  = [跳过重复] ${item.record.title} — ${person}`)
  }
  for (const warning of warnings) console.warn(`  ! ${warning}`)
  if (!additions.books.length && !additions.music.length) console.log('  没有需要写入的新记录。')
}

async function confirmWrite() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('当前终端不能交互确认；确认预览后请加 --yes，或使用 --dry-run')
  }
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  try {
    const answer = await prompt.question('\n确认写入 src/data/library.json？[y/N] ')
    return ['y', 'yes'].includes(answer.trim().toLowerCase())
  } finally {
    prompt.close()
  }
}

async function readLibrary() {
  const library = JSON.parse(await readFile(LIBRARY_PATH, 'utf8'))
  if (!library || !Array.isArray(library.books) || !Array.isArray(library.music)) {
    throw new Error('src/data/library.json 结构不正确')
  }
  return library
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log(usage)
    return
  }
  if (options.urls.length === 0 && options.files.length === 0) {
    console.log(usage)
    throw new Error('请提供至少一个公开链接或 JSON 文件')
  }

  const date = formatShanghaiDate()
  const collected = { books: [], music: [], warnings: [] }
  for (const url of options.urls) {
    const result = await collectFromUrl(url, { date, bookStatus: options.bookStatus, fetchImpl: fetch })
    collected.books.push(...result.books)
    collected.music.push(...result.music)
    collected.warnings.push(...result.warnings)
  }
  for (const file of options.files) {
    const result = await collectFromFile(file, date)
    collected.books.push(...result.books)
    collected.music.push(...result.music)
  }

  const library = await readLibrary()
  const bookResult = partitionAdditions(library.books, collected.books, 'books')
  const musicResult = partitionAdditions(library.music, collected.music, 'music')
  const additions = { books: bookResult.additions, music: musicResult.additions }
  const skipped = [...bookResult.skipped, ...musicResult.skipped]
  printPreview(additions, skipped, collected.warnings)

  if (options.dryRun || (!additions.books.length && !additions.music.length)) {
    console.log(options.dryRun ? '\n预览结束，未写入文件。' : '\n同步结束，文件没有变化。')
    return
  }

  const confirmed = options.yes || await confirmWrite()
  if (!confirmed) {
    console.log('\n已取消，文件没有变化。')
    return
  }

  library.books.push(...additions.books)
  library.music.push(...additions.music)
  await writeFile(LIBRARY_PATH, `${JSON.stringify(library, null, 2)}\n`, 'utf8')
  console.log(`\n已写入 ${additions.books.length} 本书、${additions.music.length} 首音乐。`)
  console.log('下一步可运行 npm run dev 预览，再决定是否提交到 GitHub。')
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  main().catch((error) => {
    console.error(`\n同步失败：${error.message}`)
    process.exitCode = 1
  })
}
