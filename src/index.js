const App = require('./structures/App')
const WebServer = require('./structures/WebServer')

const app = new App()
const web = new WebServer(app)

app.webserver = web
web.start(5000)
