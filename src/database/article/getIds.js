/**
 * get the list of article IDs
 * @param {*} db the DatabaseHandler object
 * @param {*} data data
 */
module.exports = async (db, data = {}) => {
  const limit = data.limit || 10

  switch (db.type) {
    case 'internal':
      const list = db.obj.articles
      const data = list.slice(-1 * limit).map(el => el.id)
      return data
  }
}
