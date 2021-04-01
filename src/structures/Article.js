const dbquery = require('../database/methods')
const { sanitizeHtml } = require('../utils/output')

class Article {
  constructor (app, data) {
    this.app = app
    this.deleted = false

    this.id = data.id
    this.title = data.title
    this.content = data.content
  }

  async edit (data) {
    const editData = { id: this.id }
    if (data.title) editData.title = data.title
    if (data.content) editData.content = data.content

    // NOTE: sanitize html if rawMode is false
    if (!data.useHTML) {
      editData.content = sanitizeHtml(editData.content)
    }

    await dbquery.article.edit(this.app.db, editData)
  }

  async delete () {
    await dbquery.article.delete(this.app.db, { id: this.id })
    this.deleted = true
    this.app.articles.cache.del(this.id)
  }
}

module.exports = Article
