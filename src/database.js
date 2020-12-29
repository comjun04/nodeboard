const storage = {
  article: []
}

const get = (key) => storage[key]
const set = (key, value) => storage[key] = value

module.exports = {
  get,
  set
}
