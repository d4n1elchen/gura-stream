<script setup lang="ts">
import ChatRoom from '@/components/ChatRoom.vue'
import YouTubePlayer from '@/components/YouTubePlayer.vue'
import { usePlaybackStateStore } from '@/stores/playbackState'

const playbackStateStore = usePlaybackStateStore()

playbackStateStore.bindEvents()
</script>

<style scoped lang="scss">
#player {
  height: 460px;
  width: 100%;
}
#chat {
  height: 460px;
  margin: 20px 0;
}
</style>

<template>
  <main>
    <YouTubePlayer
      :init-video-id="playbackStateStore.initVideoId"
      :init-time="playbackStateStore.initTime"
      id="player"
    />
    <ChatRoom id="chat" />
  </main>
</template>
