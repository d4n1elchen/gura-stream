import express from 'express'
import { createServer } from 'http'
import { dirname } from 'path'
import serveStatic from 'serve-static'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { type ChatMessage } from './src/stores/chat.js'
import { type PlaybackState } from './src/stores/playbackState.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(serveStatic(__dirname + '/dist'))

const playbackState: PlaybackState = {
  videoId: 'dBK0gKW61NU',
  time: 220,
}

const chatHistory: ChatMessage[] = []

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)

  // Playback state sync
  socket.emit('init-playback-state', playbackState)

  socket.on('sync-playback-state', () => {
    socket.emit('update-playback-state', playbackState)
  })

  // Chat
  socket.emit('message-history', chatHistory)

  socket.on('send-message', (message: ChatMessage) => {
    chatHistory.push(message)
    if (chatHistory.length > 100) {
      chatHistory.shift()
    }
    io.emit('new-message', message)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
