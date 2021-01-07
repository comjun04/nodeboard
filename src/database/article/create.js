module.exports = async (db, data = {}) => {
  const { title, content } = data
  const articleList = db.get('article')
  const lastArticleId = articleList[articleList.length - 1] != null
    ? articleList[articleList.length - 1].id
    : -1
  articleList.push({
    id: lastArticleId + 1,
    title,
    content
  })
}
