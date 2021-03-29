const methods = require('./methods')

class DatabaseHandler {
  constructor (app, config = {}) {
    this.app = app

    this.type = config.type || 'internal'
    this.methods = methods
  }

  init () {
    switch (this.type) {
      case 'internal':
        this.initInternalDB()
        break
    }
  }

  initInternalDB () {
    this.obj = {
      articles: []
    }
  }
}

module.exports = DatabaseHandler
