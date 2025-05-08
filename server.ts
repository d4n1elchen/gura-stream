import express from 'express'
import fs from 'fs'
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

type VideoInfo = {
  id: string
  length: number
  title: string
  timestamp: number
}

type PlayerState = {
  playlist: VideoInfo[]
  currentVideoIndex: number
  currentTime: number
}

// Simulate a YouTube video player
class SimPlayer {
  playlist: VideoInfo[] = []
  currentVideoIndex: number = 0
  currentTime: number = 0
  onNext: (state: PlaybackState) => void
  playerIntervalId: NodeJS.Timeout | null = null

  constructor(initState: PlayerState, onNext: (state: PlaybackState) => void) {
    this.playlist = initState.playlist
    this.currentVideoIndex = initState.currentVideoIndex
    this.currentTime = initState.currentTime
    this.onNext = onNext
  }

  toPlaybackState(): PlaybackState {
    return {
      videoId: this.playlist[this.currentVideoIndex].id,
      time: this.currentTime,
    }
  }

  toPlayerState(): PlayerState {
    return {
      playlist: this.playlist,
      currentVideoIndex: this.currentVideoIndex,
      currentTime: this.currentTime,
    }
  }

  play() {
    this.playerIntervalId = setInterval(() => {
      this.currentTime++

      if (this.currentTime >= this.playlist[this.currentVideoIndex].length) {
        this.stop()

        setTimeout(() => {
          this.currentVideoIndex++
          if (this.currentVideoIndex >= this.playlist.length) {
            this.currentVideoIndex = 0
          }
          this.currentTime = 0
          serverState.playerState = this.toPlayerState()
          this.onNext(this.toPlaybackState())
          this.play()
        }, 3000)
      }

      serverState.playerState = this.toPlayerState()
    }, 1000)
  }

  stop() {
    if (this.playerIntervalId) {
      clearInterval(this.playerIntervalId)
      this.playerIntervalId = null
    }
  }
}

type ServerState = {
  playerState: PlayerState
  chatHistory: ChatMessage[]
}

// Read the server state from a file if it exists
let serverState: ServerState
try {
  const serverStateFile = fs.readFileSync('serverState.json', 'utf8')
  serverState = JSON.parse(serverStateFile)
  const playlistFile = fs.readFileSync('playlist.json', 'utf8')
  const playlist = JSON.parse(playlistFile)
  serverState.playerState.playlist = playlist
} catch (err) {
  console.log('Error reading server state file, initializing with default values:', err)
  // Initialize with default values if the file does not exist
  serverState = {
    playerState: {
      playlist: [
        {
          id: 'dBK0gKW61NU',
          length: 3200,
          title: '[DEBUT STREAM] SHAAAAAARK #hololiveEnglish #holoMyth',
          timestamp: 1599948752,
        },
      ],
      currentVideoIndex: 0,
      currentTime: 220,
    },
    chatHistory: [{ userId: 'Gura', message: 'A!' }],
  }
}

const player = new SimPlayer(serverState.playerState, (state: PlaybackState) => {
  io.emit('update-playback-state', state)
})
player.play()

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id)

  // Playback state sync
  socket.emit('init-playback-state', player.toPlaybackState())

  socket.on('sync-playback-state', () => {
    socket.emit('update-playback-state', player.toPlaybackState())
  })

  // Chat
  socket.emit('message-history', serverState.chatHistory)

  socket.on('send-message', (message: ChatMessage) => {
    serverState.chatHistory.push(message)
    if (serverState.chatHistory.length > 100) {
      serverState.chatHistory.shift()
    }
    io.emit('new-message', message)
  })
})

// Save the server state to a file every 5 seconds
setInterval(() => {
  // Save serverState to a file (e.g., JSON)
  fs.writeFileSync('serverState.json', JSON.stringify(serverState))
}, 5000)

server.listen(3000, () => {
  console.log('listening on *:3000')
})
