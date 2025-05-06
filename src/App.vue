<script setup lang="ts">
import '@/socket'
import { socket } from '@/socket'
import { useConnectionStore } from '@/stores/connection'
import { usePlaybackStateStore } from '@/stores/playbackState'
import { RouterView } from 'vue-router'

const playbackStateStore = usePlaybackStateStore()
const connectionStore = useConnectionStore()

// remove any existing listeners (after a hot module replacement)
socket.off()

playbackStateStore.bindEvents()
connectionStore.bindEvents()
</script>

<template>
  <div>
    {{ connectionStore.isConnected ? 'connected' : 'disconnected' }}
    <button @click="() => playbackStateStore.syncPlaybackState()">Sync</button>
  </div>

  <RouterView />
</template>

<style scoped></style>
