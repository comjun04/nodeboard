module.exports = async (db, data = {}) => {
  const {
    title,
    content,
    rawMode
  } = data

  switch (db.type) {
    case 'internal': {
      const list = db.obj.articles
      const lastArticleId = list.length > 0 ?
        list[list.length - 1].id :
        -1
      const articleId = lastArticleId + 1
      
      db.obj.articles.push({
        id: articleId,
        title,
        content,
        raw: rawMode
      })

      return {
        id: articleId,
        title,
        content,
        raw: rawMode
      }
    }
  }
}
