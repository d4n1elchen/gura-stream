<script setup lang="ts">
import ChatRoom from '@/components/ChatRoom.vue'
import YouTubePlayer from '@/components/YouTubePlayer.vue'
import { usePlaybackStateStore } from '@/stores/playbackState'

const playbackStateStore = usePlaybackStateStore()

playbackStateStore.bindEvents()
</script>

<template>
  <main>
    <YouTubePlayer
      :init-video-id="playbackStateStore.initVideoId"
      :init-time="playbackStateStore.initTime"
    />
    <ChatRoom />
  </main>
</template>
