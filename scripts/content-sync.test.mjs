import test from 'node:test'
import assert from 'node:assert/strict'
import {
  extractNeteaseSongIds,
  normalizeBook,
  normalizeMusic,
  parseNeteaseSongHtml,
  parseWereadBookHtml,
  recordsMatch,
} from './content-sync.mjs'

test('parses a public NetEase song page without inventing fields', () => {
  const html = `
    <html>
      <head>
        <title>真情流露 - 张学友 - 单曲 - 网易云音乐</title>
        <meta property="og:title" content="真情流露">
        <meta property="og:image" content="http://p1.music.126.net/example/cover.jpg">
        <meta property="og:description" content="歌曲名《真情流露》，由 张学友 演唱，收录于《真情流露》专辑中">
      </head>
    </html>
  `

  assert.deepEqual(parseNeteaseSongHtml(html, '190545', '2026-08-10'), {
    id: 'netease-song-190545',
    title: '真情流露',
    artist: '张学友',
    cover: 'https://p1.music.126.net/example/cover.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=190545',
    source: 'netease',
    sourceId: '190545',
    addedAt: '2026-08-10',
    updatedAt: '2026-08-10',
  })
})

test('rejects a NetEase page when public metadata is incomplete', () => {
  assert.throws(
    () => parseNeteaseSongHtml('<title>只有歌名</title>', '1', '2026-08-10'),
    /缺少歌名、歌手或封面/,
  )
})

test('extracts unique song IDs from a public NetEase playlist page', () => {
  const html = `
    <ul class="f-hide">
      <li><a href="/song?id=190545">真情流露</a></li>
      <li><a href="/song?id=189841&amp;from=playlist">离开以后</a></li>
      <li><a href="/song?id=190545">重复链接</a></li>
    </ul>
  `

  assert.deepEqual(extractNeteaseSongIds(html), ['190545', '189841'])
})

test('parses a WeRead public page only with an explicit reading status', () => {
  const html = `
    <html>
      <head>
        <title>活着 - 微信读书</title>
        <meta property="og:title" content="活着｜微信读书">
        <meta property="og:image" content="https://cdn.example.com/alive.jpg">
        <script type="application/json">{"bookId":"weread-123","author":"余华"}</script>
      </head>
    </html>
  `

  const book = parseWereadBookHtml(
    html,
    'https://weread.qq.com/web/bookDetail/weread-123',
    '在读',
    '2026-08-10',
  )

  assert.equal(book.title, '活着')
  assert.equal(book.author, '余华')
  assert.equal(book.status, '在读')
  assert.equal(book.sourceId, 'weread-123')
  assert.equal(book.addedAt, '2026-08-10')
})

test('does not infer a WeRead status from the page', () => {
  assert.throws(
    () => parseWereadBookHtml('<title>活着 - 微信读书</title>', 'https://weread.qq.com/web/bookDetail/1'),
    /必须明确提供阅读状态/,
  )
})

test('recognizes hash and direct NetEase URLs as the same song', () => {
  const existing = {
    id: 'curated-song',
    title: '真情流露',
    artist: '张学友',
    externalUrl: 'https://music.163.com/#/song?id=190545',
  }
  const incoming = {
    id: 'netease-song-190545',
    title: '真情流露',
    artist: '张学友',
    externalUrl: 'https://music.163.com/song?id=190545',
  }

  assert.equal(recordsMatch('music', existing, incoming), true)
})

test('uses title and creator as the final duplicate fallback', () => {
  assert.equal(recordsMatch(
    'books',
    { id: 'first', title: ' 活着 ', author: '余华' },
    { id: 'second', title: '活着', author: '余华' },
  ), true)
  assert.equal(recordsMatch(
    'books',
    { id: 'first', title: '活着', author: '余华' },
    { id: 'second', title: '活着', author: '其他作者' },
  ), false)
})

test('normalizes explicit JSON music without adding unsupported fields', () => {
  const music = normalizeMusic({
    title: '测试单曲',
    artist: '测试音乐人',
    cover: 'https://example.com/cover.jpg',
    kind: '单曲',
  }, '2026-08-11')

  assert.equal(music.source, 'manual')
  assert.equal(music.addedAt, '2026-08-11')
  assert.equal(music.updatedAt, '2026-08-11')
  assert.equal('featured' in music, false)
})

test('rejects invalid dates and unsupported sources in JSON imports', () => {
  assert.throws(() => normalizeBook({
    title: '测试书籍',
    author: '测试作者',
    cover: 'https://example.com/book.jpg',
    status: '在读',
    addedAt: '昨天',
  }, '2026-08-11'), /YYYY-MM-DD/)

  assert.throws(() => normalizeMusic({
    title: '测试单曲',
    artist: '测试音乐人',
    cover: 'https://example.com/cover.jpg',
    kind: '单曲',
    source: 'unknown',
  }, '2026-08-11'), /不支持来源/)
})
