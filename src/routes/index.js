const db = require('../database/index')

const Router = require('@koa/router')
const router = new Router()

router.get('/', async ctx => {
  // TODO: apply new CRUD
  const articleList = ctx.state.db.get('article')
  const articles = articleList.slice().reverse()
  await ctx.render('index', { articles })
})

router.get('/article/:id', async ctx => {
  const articleExists = await db.article.exists(ctx.state.db, { id: ctx.params.id })
  if (!articleExists) {
    ctx.status = 404
    return
  }

  const article = await db.article.get(ctx.state.db, { id: ctx.params.id })
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
  await db.article.create(ctx.state.db, {
    title,
    content
  })

  // NOTE: Redirect when done
  await ctx.redirect('/')
})

router
  .get('/edit/:id', async ctx => {
    const articleExists = await db.article.exists(ctx.state.db, { id: ctx.params.id })
    if (!articleExists) {
      ctx.status = 404
      return
    }

  // NOTE: Get article
  const article = await db.article.get(ctx.state.db, {
    id: ctx.params.id
  })
  await ctx.render('write', article)
})
  .post('/edit/:id', async ctx => {
    // TODO: 글이 삭제되었는지 우선 확인

    const { title, content } = ctx.request.body

    if (!title || !content) {
      ctx.status = 400
      return
    }

    await db.article.edit(ctx.state.db, {
      id: ctx.params.id,
      title,
      content
    })

    await ctx.redirect(`/article/${ctx.params.id}`)
  })

module.exports = router
