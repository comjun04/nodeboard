const Router = require('@koa/router')
const router = new Router()

router.get('/', async ctx => {
  // TODO: apply new CRUD
  const articleList = await ctx.state.app.articles.fetch({ limit: 10 })
  const articles = [...articleList.values()].reverse()
  console.log(articles[0])
  await ctx.render('index', { articles })
})

router.get('/article/:id', async ctx => {
  const id = ctx.params.id
  const article = await ctx.state.app.articles.fetch(id)
  console.log(article)
  if (!article) {
    ctx.status = 404
    return
  }

  await ctx.render('article', article)
})

router
  .get('/write', async ctx => {
  await ctx.render('write', { article: {} })
})
  .post('/write', async ctx => {
  const data = ctx.request.body

  if (!data.title || !data.content) {
    ctx.status = 400
    return
  }

  const { title, content } = data
  await ctx.state.app.articles.create({
    title,
    content
  })

  // NOTE: Redirect when done
  await ctx.redirect('/')
})

router
  .get('/article/:id/edit', async ctx => {
    const id = ctx.params.id
    const article = await ctx.state.app.articles.fetch(id)
    if (!article) {
      ctx.status = 404
      return
    }

  await ctx.render('write', article)
})
  .post('/article/:id/edit', async ctx => {
    // TODO: 글이 삭제되었는지 우선 확인
    const id = ctx.params.id
    const article = await ctx.state.app.articles.fetch(id)
    if (!article) {
      ctx.status = 404
      return
    }

    const { title, content } = ctx.request.body
    if (!title || !content) {
      ctx.status = 400
      return
    }

    await article.edit({
      title,
      content
    })

    await ctx.redirect(`/article/${id}`)
  })

/*
 * Delete an article.
 * <id> - The id of article
 *
 * Use POST instead of DELETE because HTML Form method does not support it
 */
router
  .post('/article/:id/delete', async ctx => {
    const id = ctx.params.id
    const article = await ctx.state.app.articles.fetch(id)

    // TODO: custom error page
    if (!article) return ctx.status = 404
    
    await article.delete()

    await ctx.redirect('/')
  })

// Temp
router.get('/login', async (ctx) => {
  await ctx.render('login')
})

module.exports = router
