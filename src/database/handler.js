const fs = require('fs/promises')
const path = require('path')
const { EventEmitter } = require('events')

const methods = require('./methods')

const _debug = require('../utils/logger')('DatabaseHandler')

class DatabaseHandler {
  constructor (app, config = {}) {
    this.app = app

    this.type = config.type || 'internal'
    this.methods = methods
  }

  async initAsync () {
    const debug = _debug.extendFunc('init')
    debug('init database storage for %o type', this.type)

    switch (this.type) {
      case 'internal':
        this.initInternalDB()
        break

      case 'json':
        this.initInternalDB()
        await this.initJSONStorage()
        this.setupSaveInterval()
        break
    }
  }

  initInternalDB () {
    this.obj = {
      articles: []
    }
  }

  async initJSONStorage () {
    const debug = _debug.extendFunc('initJSONStorage')
    debug('init JSON storage')

    const dirpath = path.join(path.resolve(), 'data')
    let isDirExist
    
    // NOTE: check if 'data' dir exists
    try {
      const lstat = await fs.lstat(dirpath)
      isDirExist = lstat.isDirectory()
    } catch (e) {
      if (e.code === 'ENOENT') isDirExist = false
      else throw e
    }

    debug('is data directory exist? %o', isDirExist)

    if (!isDirExist) {
      await fs.mkdir(dirpath)
    }

    // NOTE: files to load to specific properties
    this.structures = {
      articles: 'articles.json'
    }

    const structEntries = Object.entries(this.structures)
    for await (const [propName, filename] of structEntries) {
      debug('file for %o property: %o', propName, filename)

      const filepath = path.join(path.resolve(), 'data', filename)
      let isExist
      try {
        const lstat = await fs.lstat(filepath)
        isExist = lstat.isFile()
      } catch (e) {
        if (e.code === 'ENOENT') isExist = false
        else throw e
      }

      debug('is file exist? %o', isExist)

      let data = this.obj[propName]
      if (isExist) {
        debug('loading file')
        const text = await fs.readFile(filepath, 'utf8')
        data = JSON.parse(text)
      } else {
        const defaultValue = JSON.stringify(data)

        debug('creating file %o with default value: %o', filename, defaultValue)
        await fs.writeFile(filepath, defaultValue)
      }

      this.obj[propName] = data
    }
  }

  async save () {
    const debug = _debug.extendFunc('save')

    debug('saving data')
    switch(this.type) {
      case 'json': {
        const structEntries = Object.entries(this.structures)
        for await (const [propName, filename] of structEntries) {
          const filepath = path.join(path.resolve(), 'data', filename)
          const data = JSON.stringify(this.obj[propName]?? {})
          console.log(this.obj, data)

          debug('writing to %o', filename)
          await fs.writeFile(filepath, data)
        }
      }
    }
  }

  setupSaveInterval () {
    const debug = _debug.extendFunc('setupSaveInterval')

    const emitter = new EventEmitter()
    const listener = () => {
      setTimeout(async () => {
        await this.save()
        emitter.emit('trigger')
      }, 1000 * 5)
    }

    debug('start triggering save interval')
    emitter.on('trigger', listener)
    emitter.emit('trigger')
  }
}

module.exports = DatabaseHandler
