const dbquery = require('../database/methods')
const { sanitizeHtml, replaceLineBreak } = require('../utils/output')

class Article {
  constructor (app, data) {
    this.app = app
    this.deleted = false

    this.id = data.id
    this.title = data.title
    this.content = data.content
    this.raw = data.raw || false
  }

  async edit (data) {
    const editData = { id: this.id }
    if (data.title) editData.title = data.title
    if (data.content) editData.content = data.content

    // NOTE: sanitize html if rawMode is false
    if (!data.rawMode) {
      editData.content = sanitizeHtml(editData.content)
    }

    await dbquery.article.edit(this.app.db, editData)
  }

  async delete () {
    await dbquery.article.delete(this.app.db, { id: this.id })
    this.deleted = true
    this.app.articles.cache.del(this.id)
  }

  getProcessedContent () {
    let final = this.content

    if (!this.raw) {
      final = replaceLineBreak(final)
      
    }

    return final
  }
}

module.exports = Article
