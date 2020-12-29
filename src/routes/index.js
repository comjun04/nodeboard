const Router = require('@koa/router')
const router = new Router()

router.get('/', async ctx => {
  const articleList = ctx.state.db.get('article')
  const articles = articleList.slice().reverse()
  await ctx.render('index', { articles })
})

router.get('/article', async ctx => {
  await ctx.render('article')
})

router.get('/write', async ctx => {
  await ctx.render('write')
})

router.post('/write', async ctx => {
  const data = ctx.request.body

  if (!data.title || !data.content) {
    ctx.status = 400
    return
  }

  const db = ctx.state.db
  const articleList = db.get('article')
  const lastArticleId = articleList[articleList.length - 1] != null
    ? articleList[articleList.length - 1].id
    : -1
  articleList.push({
    id: lastArticleId + 1,
    title: data.title,
    content: data.content
  })

  // NOTE: Redirect when done
  await ctx.redirect('/')
})

module.exports = router
