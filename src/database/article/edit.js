const exists = require('./exists')
const get = require('./get')

module.exports = async (db, data = {}) => {
  const { id, title, content } = data

  //const articleExists = await exists(db, { id })
  //if (!articleExists) throw new Error('article does not exist')

  switch (db.type) {
    case 'internal':
    case 'json': {
      const article = await get(db, { id })
      article.title = title
      article.content = content
      break
    }
  }
}
