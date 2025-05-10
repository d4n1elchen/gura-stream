import type { ChatMessage, PlaybackState, UserInfo } from '@common/types'
import axios, { AxiosError } from 'axios'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import fs from 'fs'
import { createServer } from 'http'
import Redis from 'ioredis'
import { Server } from 'socket.io'
import { discord } from './discord'
import { PlayerState, SimPlayer } from './player'

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: corsOptions })
const redis = new Redis()

app.use(cors(corsOptions))
app.use(express.json())

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
      currentTime: 220,
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

app.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
)

app.post('/login', async ({ body, session }, res) => {
  if (session.userId && (await redis.exists(`user:${session.userId}`)) === 1) {
    res.status(200).send('Already logged in')
    return
  }
  const code = body.code
  if (!code) {
    res.status(400).send('Missing code')
    return
  }
  try {
    const token = await discord.getToken(code as string)
    const member = await discord.getAtlantisMember(token.access_token)
    session.userId = member.user.id
    await redis.set(`user:${session.userId}`, JSON.stringify({ member, token }))
    res.status(200).send('OK')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError
      res.status(axiosError.response?.status || 500)
    }
    res.send(err)
  }
})

const requireAuth = async (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    res.status(401).send('Unauthorized')
    return
  }
  const user = await redis.get(`user:${req.session.userId}`)
  if (!user) {
    res.status(401).send('Unauthorized')
    return
  }
  res.locals.user = JSON.parse(user)
  next()
}

app.post('/user', requireAuth, (req, res) => {
  const { member } = res.locals.user
  const userInfo: UserInfo = {
    id: member.user.id,
    username: member.user.username,
    avatar: member.user.avatar,
  }
  res.status(200).json(userInfo)
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
