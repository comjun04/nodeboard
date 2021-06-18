const debug = require('debug')

function func (scope) {
  const logger = debug(`nodeboard:${scope}`)
  logger.extendCustom = (s) => func(`${scope}${s}`)
  logger.extendFunc = (s) => logger.extendCustom(`/${s}`)

  return logger
}

module.exports = func
