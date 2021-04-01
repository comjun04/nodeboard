const { replaceLineBreak } = require('../utils/output')

const Router = require('@koa/router')
const router = new Router()

router.get('/:id', async (ctx, next) => {
  const id = ctx.params.id
  const idInt = parseInt(id)
  if (isNaN(idInt) || !Number.isInteger(idInt)) return await next()

  const article = await ctx.state.app.articles.fetch(id)
  console.log(article)
  if (!article) {
    ctx.status = 404
    return
  }

  article.content = replaceLineBreak(article.content)

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

  const { title, content, useHTML } = data
  await ctx.state.app.articles.create({
    title,
    content,
    useHTML
  })

  // NOTE: Redirect when done
  ctx.redirect('/')
})

router
  .get('/:id/edit', async ctx => {
    const id = ctx.params.id
    const article = await ctx.state.app.articles.fetch(id)
    if (!article) {
      ctx.status = 404
      return
    }

    await ctx.render('write', article)
})
  .post('/:id/edit', async ctx => {
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

    ctx.redirect(`/article/${id}`)
  })

router
  .post('/:id/delete', async (ctx) => {
    const id = ctx.params.id
    const idInt = parseInt(id)
    if (isNaN(idInt) || !Number.isInteger(idInt)) {
      ctx.status = 400
      return
    }

    const article = await ctx.state.app.articles.fetch(id)
    if (!article) {
      ctx.status = 404
      return
    }

    await article.delete()

    ctx.redirect('/')
  })  

module.exports = router
