const dbquery = require('../database/methods')

class Article {
  constructor (app, data) {
    this.app = app

    this.id = data.id
    this.title = data.title
    this.content = data.content
  }

  async edit (data) {
    const editData = { id: this.id }
    if (data.title) editData.title = data.title
    if (data.content) editData.content = data.content

    await dbquery.article.edit(this.app.db, editData)
  }

  async delete () {
    await this.app.articles.delete(this)
  }
}

module.exports = Article
