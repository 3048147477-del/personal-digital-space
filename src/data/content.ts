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
  name: '名字待补充',
  shortBio: '这里会放一段真实、简短的自我介绍。它不需要概括一切，只需要让第一次来的人知道你是谁。',
  longBio: '关于你的成长、选择和现在正在做的事，都会在你提供真实资料后写进这里。基础版本先保留结构，不替你编造故事。',
  currentStatus: '当前状态待补充',
  links: [],
}

export const experiences: Experience[] = []
export const games: Game[] = []
export const books: Book[] = []
export const music: Music[] = []
export const films: Film[] = []

export const collections = {
  games,
  books,
  music,
  films,
}

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

export const getCollectionMeta = (kind: CollectionKind) =>
  collectionMeta.find((item) => item.kind === kind) as CollectionMeta
