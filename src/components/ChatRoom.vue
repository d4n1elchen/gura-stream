<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { ref } from 'vue'

const chatStore = useChatStore()
const connectionStore = useConnectionStore()

const newMessage = ref('')
const userId = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    chatStore.sendMessage(userId.value, newMessage.value)
    newMessage.value = ''
  }
}
</script>

<style lang="scss" scoped>
.chat {
  height: 460px;
  display: flex;
  flex-direction: column;

  .messages {
    flex-grow: 1;
  }

  .chat-input {
    display: flex;
    gap: 10px;
  }
}
</style>

<template>
  <div class="chat ts-box">
    <div class="status ts-content">
      <span :style="`color: ${connectionStore.isConnected ? 'green' : 'red'}`">◉</span>
      {{ connectionStore.isConnected ? 'Connected' : 'Disconnected' }} to Chat
    </div>
    <div class="ts-divider"></div>
    <div class="messages ts-content">
      <div v-for="message in chatStore.chat" :key="message.userId" class="message">
        <span class="ts-text is-bold">{{ message.userId }}</span> {{ message.message }}
      </div>
    </div>
    <div class="ts-divider"></div>
    <div class="chat-input ts-content">
      <div class="ts-input">
        <input v-model="userId" placeholder="Your name..." />
      </div>
      <div class="ts-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Chat..." />
      </div>
    </div>
  </div>
</template>
