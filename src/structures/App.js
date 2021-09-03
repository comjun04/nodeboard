const DatabaseHandler = require('../database/handler')
const ArticleMgr = require('../managers/ArticleManager')

class App {
  constructor () {
    this.db = new DatabaseHandler(this, { type: 'json' })

    this.articles = new ArticleMgr(this)
  }

  async initAsync () {
    await this.db.initAsync()
  }
}

module.exports = App
