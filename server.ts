import express from 'express'
import { createServer } from 'http'
import { dirname } from 'path'
import serveStatic from 'serve-static'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(serveStatic(__dirname + '/dist'))

const playBackState = {
  currentVideoId: '',
  currentTime: 0,
}

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)
  socket.emit('init-playback-state', playBackState)
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
