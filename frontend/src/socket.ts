import { io } from 'socket.io-client'
import { config } from './config'

export const socket = io(config.backendUrl, {
  path: '/api/socket.io',
  transports: ['websocket'],
  secure: true,
})
