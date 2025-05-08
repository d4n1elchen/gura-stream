import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConnectionStore = defineStore('connection', () => {
  const isConnected = ref(false)

  function bindEvents() {
    socket.on('connect', () => {
      isConnected.value = true
    })

    socket.on('disconnect', () => {
      isConnected.value = false
    })
  }

  function connect() {
    socket.connect()
  }

  return { isConnected, connect, bindEvents }
})
