import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ChatMessage = {
  userId: string
  message: string
}

export const useChatStore = defineStore('chat', () => {
  const chat = ref([] as ChatMessage[])

  function bindEvents() {
    socket.on('new-message', (message: ChatMessage) => {
      chat.value.push(message)
    })

    socket.on('message-history', (messages: ChatMessage[]) => {
      chat.value = messages
    })
  }

  function sendMessage(userId: string, message: string) {
    const chatMessage: ChatMessage = { userId, message }
    socket.emit('send-message', chatMessage)
  }

  return { chat, bindEvents, sendMessage }
})
