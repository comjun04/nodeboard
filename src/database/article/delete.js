const exists = require('./exists')

module.exports = async (db, data = {}) => {
  const { id } = data

  if (!await exists(db, { id })) throw new Error('Not Found')

  switch (db.type) {
    case 'internal':
    case 'json': {
      const articleList = db.obj.articles
      const idx = articleList.findIndex(el => el.id === id)
      articleList.splice(idx, 1)
      break
    }
  }
}
