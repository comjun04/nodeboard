const path = require('path')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')

const db = require('./database')
const router = require('./routes/index')

const Koa = require('koa')
const app = new Koa()

// Put values before routing
app.use(async (ctx, next) => {
  ctx.state.db = db
  await next()
})

const renderView = views(path.join(__dirname, 'views'), {
  extension: 'ejs', 
  map: {
    ejs: 'ejs'
  }
})
app.use(renderView)

app.use(bodyParser())
app.use(router.routes())

app.listen(5000, () => {
  console.log('Running on port 5000')
})
