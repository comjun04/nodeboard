const path = require('path')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')

const router = require('../routes/index')

const Koa = require('koa')

const debug = require('debug')('nodeboard:web')

class WebServer {
  constructor (app) {
    this.server = app

    const server = new Koa()
    this.server = server

    // Put values before routing
    server.use(async (ctx, next) => {
      ctx.state = {
        db: app.db,
        app
      }

      debug(`${ctx.method} ${ctx.url}`)

      await next()
    })

    const renderView = views(path.join(__dirname, '../views'), {
      extension: 'ejs',
      map: {
        ejs: 'ejs'
      }
    })
    server.use(renderView)

    server.use(bodyParser())
    server.use(router.routes())
  }

  async start (port = 5000) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        console.log('Running on port ' + port)
        resolve()
      })
    })
  }
}

module.exports = WebServer
