<script setup lang="ts">
import '@/socket'
import { socket } from '@/socket'
import { useChatStore } from '@/stores/chat'
import { useConnectionStore } from '@/stores/connection'
import { usePlaybackStateStore } from '@/stores/playbackState'
import { RouterView } from 'vue-router'

const playbackStateStore = usePlaybackStateStore()
const connectionStore = useConnectionStore()
const chatStore = useChatStore()

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
