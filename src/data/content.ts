import type {
  Book,
  CollectionKind,
  Experience,
  Film,
  Game,
  Music,
  Profile,
} from '../types'

export const profile: Profile = {
  name: '旺角西多士',
  shortBio: '我是旺角西多士，来自海南文昌。22 岁的我还在慢慢认识世界，也正在学习成为一名 AI 训练师。很多别人早已习惯的事物，对我仍然新鲜；我想保留这份新鲜感，一点点找到自己的生活。',
  longBio: '我今年 22 岁，很多东西现在才刚开始接触。成长得慢一些，不只意味着错过：那些别人早已习惯甚至厌倦的事物，对我来说仍然新鲜。我想从这些迟来的第一次出发，逐渐寻找真正属于自己的生活，也慢慢认识自己。',
  currentStatus: '正在学习成为一名 AI 训练师，也在逐渐寻找自己的生活。',
  location: '海南文昌 · 椰子国，槟榔乡',
  avatar: '/images/wangjiaoxiduoshi-avatar.jpg',
  links: [
    {
      label: '3048147477@proton.me',
      href: 'mailto:3048147477@proton.me',
    },
    {
      label: 'Steam',
      href: 'https://steamcommunity.com/profiles/76561198450138818',
    },
    {
      label: '网易云音乐',
      href: 'https://music.163.com/#/user/home?id=449747118',
    },
  ],
}

export const experiences: Experience[] = []
export const games: Game[] = [
    {
      id: 'counter-strike-2',
      title: 'Counter-Strike 2',
      cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg',
      artwork: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/library_hero.jpg',
    platforms: ['PC', 'Steam'],
    hours: 1764,
    updatedAt: '2026-07-19',
  },
  {
      id: 'dont-starve-together',
      title: '饥荒联机版',
      cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/322330/capsule_616x353.jpg',
      artwork: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/322330/library_hero.jpg',
    platforms: ['PC', 'Steam'],
    hours: 382,
    note: '“巨好玩！！”——我在 Steam 留下的公开评测。',
    updatedAt: '2026-07-09',
  },
  {
      id: 'grand-theft-auto-v-enhanced',
      title: 'Grand Theft Auto V 增强版',
      cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3240220/header_2x.jpg',
      artwork: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3240220/library_hero.jpg',
    platforms: ['PC', 'Steam'],
    hours: 169,
    updatedAt: '2026-07-08',
  },
  {
      id: 'red-dead-redemption-2',
      title: '荒野大镖客：救赎 2',
      cover: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg',
      artwork: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_hero.jpg',
    platforms: ['PC', 'Steam'],
    hours: 119.2,
    note: '“RED Dead Redemption 2 永远的神！”——我在 2023 年留下的 Steam 公开评测。',
    updatedAt: '2023-08-06',
  },
]
export const books: Book[] = []
export const music: Music[] = [
  {
    id: 'jacky-cheung-true-love-expression',
    title: '真情流露',
    artist: '张学友',
    cover: 'https://p1.music.126.net/WnUag3-ayASzbwDlIMGR4g==/109951169502337739.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=190545',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
  {
    id: 'jacky-cheung-after-leaving',
    title: '离开以后',
    artist: '张学友',
    cover: 'https://p1.music.126.net/R7YSGl_0witBfdWf9mufsw==/109951169426794963.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=189841',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
  {
    id: 'alan-tam-grateful-without-words',
    title: '无言感激',
    artist: '谭咏麟',
    cover: 'https://p1.music.126.net/HNsE3Rop6IbPH_joAeQ5Kw==/109951172051775586.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=4871704',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
  {
    id: 'jj-lin-jiang-nan',
    title: '江南',
    artist: '林俊杰',
    cover: 'https://p1.music.126.net/Gk4t93WwafRZtt9nTS77Iw==/109951171891430447.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=108914',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
  {
    id: 'time-savings-jar-journey',
    title: 'Journey',
    artist: '时空储蓄罐',
    cover: 'https://p1.music.126.net/tlwiCdeOGeQGtp8fl4QgeQ==/109951170456461821.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=2672411882',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
  {
    id: 'faith-yang-push-open-the-door-live',
    title: '推开世界的门 (Live)',
    artist: '杨乃文',
    cover: 'https://p1.music.126.net/a9jDaNy0LHI9_QaFDzJzZQ==/109951166557912027.jpg',
    kind: '单曲',
    externalUrl: 'https://music.163.com/#/song?id=1350658589',
    note: '收录在我的 2025 年度歌单。',
    updatedAt: '2025-12-29',
  },
]
export const films: Film[] = []

export const collections = {
  games,
  books,
  music,
  films,
}

export const getCollectionArtworkItems = (kind: CollectionKind) =>
  collections[kind].map((item) => ({
    src: 'poster' in item ? item.poster : item.cover,
    label: item.title,
  }))

export interface CollectionMeta {
  kind: CollectionKind
  title: string
  action: string
  path: string
  description: string
  emptyTitle: string
  emptyDescription: string
  fields: string[]
  mark: string
}

export const collectionMeta: CollectionMeta[] = [
  {
    kind: 'games',
    title: '游戏与时长',
    action: '查看游戏',
    path: '/shelf/games',
    description: '玩过什么，以及时间真正花在了哪里。',
    emptyTitle: '还没有添加游戏记录',
    emptyDescription: '准备好游戏名称、平台、状态和大致游玩时长后，就可以从这里开始。',
    fields: ['游戏名称', '平台', '游玩时长', '完成状态', '可选感想'],
    mark: 'PLAY',
  },
  {
    kind: 'books',
    title: '书籍',
    action: '查看书籍',
    path: '/shelf/books',
    description: '读过、正在读，以及准备认真打开的书。',
    emptyTitle: '书架正在等第一本书',
    emptyDescription: '提供书名、作者和阅读状态即可；短评可以以后慢慢补。',
    fields: ['书名', '作者', '阅读状态', '完成年份', '可选短评'],
    mark: 'READ',
  },
  {
    kind: 'music',
    title: '音乐',
    action: '查看音乐',
    path: '/shelf/music',
    description: '反复听过的声音，以及它们陪伴过的时间。',
    emptyTitle: '还没有公开音乐收藏',
    emptyDescription: '可以先从一张专辑、一首单曲，或者最近反复播放的音乐开始。',
    fields: ['单曲或专辑', '音乐人', '类型', '平台链接', '可选说明'],
    mark: 'LISTEN',
  },
  {
    kind: 'films',
    title: '电影',
    action: '查看电影',
    path: '/shelf/films',
    description: '看过的银幕、记住的片段和愿意留下的感受。',
    emptyTitle: '电影记录还是空的',
    emptyDescription: '提供片名和观看时间就能建立第一条记录，导演与短评都可以选填。',
    fields: ['片名', '年份', '导演', '观看时间', '可选短评'],
    mark: 'WATCH',
  },
]

export const publicCollectionMeta = collectionMeta.filter(
  (item) => collections[item.kind].length > 0,
)

export const getCollectionMeta = (kind: CollectionKind) =>
  collectionMeta.find((item) => item.kind === kind) as CollectionMeta
