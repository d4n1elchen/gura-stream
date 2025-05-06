import { io } from 'socket.io-client'
import { reactive } from 'vue'

export const state = reactive({
  connected: false,
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

export const socket = io(URL)

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('init-playback-state', (playBackState) => {
  console.log('init-playback-state', playBackState)
  // Handle the initial playback state here
})
