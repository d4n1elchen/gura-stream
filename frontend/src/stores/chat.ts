import { socket } from '@/socket'
import type { ChatMessage, UserInfo } from '@common/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const chat = ref([] as ChatMessage[])

  function bindEvents() {
    socket.on('new-message', (message: ChatMessage) => {
      chat.value.push(message)
    })

    socket.on('message-history', (messages: ChatMessage[]) => {
      console.log('Message history:', messages)
      chat.value = messages
    })

    socket.emit('request-message-history')
  }

  function sendMessage(user: UserInfo, message: string) {
    const chatMessage: ChatMessage = { user, message }
    socket.emit('send-message', chatMessage)
  }

  return { chat, bindEvents, sendMessage }
})
