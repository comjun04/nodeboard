const LRU = require('lru-cache')

const Article = require('../structures/Article')
const dbquery = require('../database/methods')
const { sanitizeHtml } = require('../utils/output')

const debug = require('debug')('nodeboard:ArticleManager')

class ArticleManager {
  constructor (app) {
    this.app = app
    this.cache = new LRU({
      max: 50
    })
  }

  async create (articleData) {
    debug('creating new article')
    const { db } = this.app

    const title = articleData.title
    let content = articleData.content
    const rawMode = articleData.useHTML

    debug('checking title and body is not empty')
    if (!articleData.title) throw new Error('title must not be empty')
    if (!articleData.content) throw new Error('content must not be empty')

    // NOTE: sanitize html if rawMode is false
    if (!rawMode) {
      content = sanitizeHtml(content)
    }

    debug('creating article to database')
    const data = await dbquery.article.create(db, {
      title,
      content
    })

    const article = new Article(this.app, data)
    this.cache.set(article.id, article)

    return article
  }

  async fetch (idOrOptions) {
    const { db } = this.app

    debug('fetch with options: %o', idOrOptions)

    if (typeof idOrOptions === 'string') {
      const id = idOrOptions

      // TODO depends on storage
      if (this.cache.has(id)) return this.cache.get(id)
      else {
        const data = await dbquery.article.get(db, { id })
        if (!data) return null

        const article = new Article(this.app, data)
        this.cache.set(article.id, article)
        return article
      }
    } else {
      const limit = idOrOptions.limit || 10
      const list = await dbquery.article.getIds(db, { limit })
      debug('list of ids: %o', list)

      const data = new Map()
      for (const item of list) {
        let d
        if (this.cache.has(item)) d = this.cache.get(item)
        else {
          const dd = await dbquery.article.get(db, { id: item })
          d = new Article(this.app, dd)
          this.cache.set(item, d)
        }

        data.set(item, d)
      }

      return data
    }
  }
}

module.exports = ArticleManager
