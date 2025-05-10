<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { useDiscordStore } from '@/stores/discord'
import { usePlaybackStateStore } from '@/stores/playbackState'
import type { UserInfo } from '@common/types'
import { nextTick, onUpdated, ref, useTemplateRef, watch } from 'vue'

const chatStore = useChatStore()
const connectionStore = useConnectionStore()
const playbackStateStore = usePlaybackStateStore()
const discordStore = useDiscordStore()

const newMessage = ref('')

discordStore.fetchUserInfo()

function goToDiscordLogin() {
  const oauth2Url = `https://discord.com/oauth2/authorize?client_id=1370294188238835722&response_type=code&redirect_uri=${encodeURIComponent(window.location.protocol + '//' + window.location.host)}&scope=identify+guilds.members.read`
  window.location.href = oauth2Url
}

function getAvatarUrl(user: UserInfo) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
}

function isForeverShimp(user: UserInfo) {
  const foreverShrimpRoleId = '846616775148044318'
  return user.roles.includes(foreverShrimpRoleId)
}

function sendMessage() {
  if (newMessage.value.trim() !== '' && discordStore.isLoggedIn && discordStore.user) {
    console.log(discordStore.user)
    chatStore.sendMessage(discordStore.user, newMessage.value.trim())
    newMessage.value = ''
  }
}

const chatBottom = useTemplateRef('chat-bottom')

function scrollToBottom() {
  nextTick(() => {
    chatBottom.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

onUpdated(scrollToBottom)
watch(chatStore.chat, scrollToBottom)
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

    .message {
      margin-bottom: 10px;
      line-height: 2em;

      .avatar {
        display: inline-block;
        width: 1.5em;
        height: 1.5em;
        margin-right: 10px;
        vertical-align: middle;
      }

      .username {
        margin-right: 5px;

        &.membership {
          color: #2ba640;
        }
      }
    }
  }

  .chat-input {
    display: flex;
    gap: 10px;

    .message-input {
      flex-grow: 1;
    }

    .login-button {
      flex-grow: 1;
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
      <div v-for="message in chatStore.chat" :key="message.user.id" class="message">
        <span class="avatar ts-image is-circular"
          ><img :src="getAvatarUrl(message.user)" alt="" srcset=""
        /></span>
        <span
          class="username ts-text is-heavy"
          :class="{ membership: isForeverShimp(message.user) }"
          >{{ message.user.username }}</span
        >
        {{ message.message }}
      </div>
      <div ref="chat-bottom"></div>
    </div>
    <div class="ts-divider"></div>
    <div class="chat-input ts-content">
      <div v-if="discordStore.isLoggedIn" class="message-input ts-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Chat..." />
      </div>
      <div v-else class="login-button">
        <button class="ts-button is-fluid" @click="goToDiscordLogin">
          <span class="pi pi-discord" style="margin-right: 5px"></span> Discord Login
        </button>
      </div>
    </div>
  </div>
</template>
