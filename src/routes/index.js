const Router = require('@koa/router')
const router = new Router()

const articleRouter = require('./article')

router.get('/', async ctx => {
  // TODO: apply new CRUD
  const articleList = await ctx.state.app.articles.fetch({ limit: 10 })
  const articles = [...articleList.values()].reverse()
  console.log(articles[0])
  await ctx.render('index', { articles })
})

router.use('/article', articleRouter.routes())

module.exports = router
