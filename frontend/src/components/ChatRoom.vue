<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { usePlaybackStateStore } from '@/stores/playbackState'
import { ref } from 'vue'

const chatStore = useChatStore()
const connectionStore = useConnectionStore()
const playbackStateStore = usePlaybackStateStore()

const newMessage = ref('')
const userId = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() !== '' && userId.value.trim() !== '') {
    chatStore.sendMessage(userId.value, newMessage.value)
    newMessage.value = ''
  }
}
</script>

<style lang="scss" scoped>
.chat {
  display: flex;
  flex-direction: column;

  .status-bar {
    display: flex;
    align-items: center;

    .status {
      flex-grow: 1;
    }
  }

  .messages {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .chat-input {
    display: flex;
    gap: 10px;

    .user-id-input {
      flex: 1;
    }
    .message-input {
      flex: 2;
    }
  }
}
</style>

<template>
  <div class="chat ts-box">
    <div class="status-bar ts-content">
      <div class="status">
        <span :style="`color: ${connectionStore.isConnected ? 'green' : 'red'}`">◉</span>
        {{ connectionStore.isConnected ? 'Connected' : 'Disconnected' }} to server
      </div>
      <button
        class="ts-button is-small is-dense"
        @click="() => playbackStateStore.syncPlaybackState()"
      >
        Sync Progress
      </button>
    </div>
    <div class="ts-divider"></div>
    <div class="messages ts-content">
      <div v-for="message in chatStore.chat" :key="message.userId" class="message">
        <span class="ts-text is-bold">{{ message.userId }}</span> {{ message.message }}
      </div>
    </div>
    <div class="ts-divider"></div>
    <div class="chat-input ts-content">
      <div class="user-id-input ts-input">
        <input v-model="userId" placeholder="Name" />
      </div>
      <div class="message-input ts-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Chat..." />
      </div>
    </div>
  </div>
</template>
