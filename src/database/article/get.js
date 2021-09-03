module.exports = async (db, data = {}) => {
  const id = parseInt(data.id)
  if (isNaN(id) || id < 0) throw new TypeError('id should be positive integer or 0')

  switch (db.type) {
    case 'internal':
    case 'json':
      return db.obj.articles[id]
  }
}
