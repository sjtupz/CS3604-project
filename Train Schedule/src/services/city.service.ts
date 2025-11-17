import Database from 'better-sqlite3'
import * as path from 'path'
import { LRUCache } from 'lru-cache'

const dbPath = path.resolve(__dirname, '../../data/database.sqlite')
const db = new Database(dbPath)

export type City = {
  id: number
  standard_name: string
  pinyin: string | null
  pinyin_initials: string | null
  admin_code: string | null
  area_code: string | null
  postal_code: string | null
  lat: number | null
  lng: number | null
  is_hot: number
  rank: number
}

export type CitySearchResult = { meta: { totalItems: number; page: number; pageSize: number }; data: City[] }

const cache = new LRUCache<string, CitySearchResult>({ max: 500, ttl: 1000 * 60 * 5 })

export class CityService {
  static search(keyword: string, page: number = 1, pageSize: number = 10): CitySearchResult {
    const q = String(keyword || '').trim()
    const key = JSON.stringify({ q, page, pageSize })
    const hit = cache.get(key)
    if (hit) return hit
    if (!q) {
      const stmt = db.prepare(
        `SELECT * FROM cities ORDER BY is_hot DESC, rank DESC LIMIT ? OFFSET ?`
      )
      const data = stmt.all(pageSize, (page - 1) * pageSize) as City[]
      const res = { meta: { totalItems: data.length, page, pageSize }, data }
      cache.set(key, res)
      return res
    }
    const isDigits = /^[0-9]+$/.test(q)
    const isLetters = /^[a-zA-Z]+$/.test(q)
    let rows: City[] = []
    if (isDigits) {
      const like = `%${q}%`
      const stmt = db.prepare(
        `SELECT *,
         (CASE WHEN admin_code LIKE ? THEN 3 ELSE 0 END +
               CASE WHEN area_code LIKE ? THEN 3 ELSE 0 END +
               CASE WHEN postal_code LIKE ? THEN 2 ELSE 0 END + rank + is_hot) AS s
         FROM cities
         WHERE admin_code LIKE ? OR area_code LIKE ? OR postal_code LIKE ?
         ORDER BY s DESC, is_hot DESC, rank DESC
         LIMIT ? OFFSET ?`
      )
      rows = stmt.all(like, like, like, like, like, like, pageSize, (page - 1) * pageSize) as City[]
    } else if (isLetters) {
      const qm = q.toLowerCase()
      const stmt = db.prepare(
        `SELECT *,
         (CASE WHEN pinyin_initials LIKE ? THEN 4 ELSE 0 END +
               CASE WHEN pinyin LIKE ? THEN 3 ELSE 0 END + rank + is_hot) AS s
         FROM cities
         WHERE pinyin_initials LIKE ? OR pinyin LIKE ?
         ORDER BY s DESC, is_hot DESC, rank DESC
         LIMIT ? OFFSET ?`
      )
      rows = stmt.all(`${qm}%`, `${qm}%`, `${qm}%`, `${qm}%`, pageSize, (page - 1) * pageSize) as City[]
    } else {
      const like = `%${q}%`
      const stmt = db.prepare(
        `SELECT *,
         (CASE WHEN standard_name = ? THEN 5 ELSE 0 END +
               CASE WHEN standard_name LIKE ? THEN 3 ELSE 0 END + rank + is_hot) AS s
         FROM cities
         WHERE standard_name LIKE ?
         ORDER BY s DESC, is_hot DESC, rank DESC
         LIMIT ? OFFSET ?`
      )
      rows = stmt.all(q, like, like, pageSize, (page - 1) * pageSize) as City[]
    }
    const res = { meta: { totalItems: rows.length, page, pageSize }, data: rows }
    cache.set(key, res)
    return res
  }
}