const exists = require('./exists')

module.exports = async (db, data = {}) => {
  const { id } = data

  if (!await exists(db, { id })) throw new Error('Not Found')

  const articleList = db.get('articles')
  const idx = articleList.findIndex()
}
