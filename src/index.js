const App = require('./structures/App')
const WebServer = require('./structures/WebServer')

const app = new App()
const web = new WebServer(app)

;(async () => {
  await app.initAsync()
  app.webserver = web
  web.start(5000)
})()
