<script setup lang="ts">
import ChatRoom from '@/components/ChatRoom.vue'
import YouTubePlayer from '@/components/YouTubePlayer.vue'
import { usePlaybackStateStore } from '@/stores/playbackState'

const playbackStateStore = usePlaybackStateStore()

playbackStateStore.bindEvents()
</script>

<style scoped lang="scss">
main {
  height: 100vh;
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
  #player {
    height: 60%;
    width: 100%;
  }
  #chat {
    height: 60%;
    width: 560px;
  }
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
