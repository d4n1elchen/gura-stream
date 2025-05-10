<script setup lang="ts">
import '@/socket'
import { socket } from '@/socket'
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { usePlaybackStateStore } from '@/stores/playbackState'
import { onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useDiscordStore } from './stores/discord'

const route = useRoute()
const router = useRouter()

const playbackStateStore = usePlaybackStateStore()
const connectionStore = useConnectionStore()
const chatStore = useChatStore()
const discordStore = useDiscordStore()

onMounted(async () => {
  await router.isReady()
  if (route.query.code) {
    discordStore.login(route.query.code as string)
  }
})

// remove any existing listeners (after a hot module replacement)
socket.off()

playbackStateStore.bindEvents()
connectionStore.bindEvents()
chatStore.bindEvents()
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
