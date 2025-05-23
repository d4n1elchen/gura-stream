import { io } from 'socket.io-client'
import { config } from './config'

export const socket = io(config.socketIoUrl, {
  path: '/socket.io',
  transports: ['websocket'],
  secure: true,
})
