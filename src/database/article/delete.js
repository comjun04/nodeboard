const exists = require('./exists')

module.exports = async (db, data = {}) => {
  const { id } = data

  if (!await exists(db, { id })) throw new Error('Not Found')

  switch (db.type) {
    case 'internal':
      const idx = db.obj.articles.findIndex(el => el.id === id)
      db.obj.articles.splice(idx, 1)
  }
}
