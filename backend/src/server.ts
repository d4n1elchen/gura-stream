import type { ChatMessage, PlaybackState } from '@common/types'
import express from 'express'
import fs from 'fs'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PlayerState, SimPlayer } from './player'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

type ServerState = {
  playerState: PlayerState
  chatHistory: ChatMessage[]
}

// Read the server state from a file if it exists
let serverState: ServerState
try {
  const serverStateFile = fs.readFileSync('serverState.json', 'utf8')
  serverState = JSON.parse(serverStateFile)
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
      currentTime: 0,
    },
    chatHistory: [{ userId: 'Gura', message: 'A!' }],
  }
}

// Read the playlist from a file if it exists
try {
  const playlistFile = fs.readFileSync('playlist.json', 'utf8')
  const playlist = JSON.parse(playlistFile)
  serverState.playerState.playlist = playlist
} catch {
  // If the playlist file does not exist, use the default playlist
}

const player = new SimPlayer(
  serverState.playerState,
  (state: PlayerState) => {
    serverState.playerState = state
  },
  (state: PlaybackState) => {
    console.log(`Playing next video: ${state.videoId}`)
    io.emit('update-playback-state', state)
  }
)
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
