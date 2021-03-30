const DatabaseHandler = require('../database/handler')
const ArticleMgr = require('../managers/ArticleManager')

class App {
  constructor () {
    this.db = new DatabaseHandler()
    this.db.init()

    this.articles = new ArticleMgr(this)
  }
}

module.exports = App
