export type CollectionKind = 'games' | 'books' | 'music' | 'films'

export interface Profile {
  name: string
  shortBio: string
  longBio: string
  currentStatus: string
  location?: string
  avatar?: string
  links: Array<{
    label: string
    href: string
  }>
}

export interface Experience {
  id: string
  startDate: string
  endDate?: string
  title: string
  organization?: string
  description: string
  tags?: string[]
  image?: string
  link?: string
}

export interface Game {
  id: string
  title: string
  cover: string
  platforms?: string[]
  hours?: number
  status: '在玩' | '通关' | '搁置' | '弃坑'
  year?: number
  note?: string
  updatedAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: '在读' | '读完' | '想读'
  finishedAt?: string
  note?: string
  updatedAt: string
}

export interface Music {
  id: string
  title: string
  artist: string
  cover: string
  kind: '单曲' | '专辑'
  externalUrl?: string
  note?: string
  updatedAt: string
}

export interface Film {
  id: string
  title: string
  poster: string
  releaseYear?: number
  director?: string
  watchedAt?: string
  note?: string
  updatedAt: string
}
