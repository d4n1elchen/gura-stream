<script setup lang="ts">
import ChatRoom from '@/components/ChatRoom.vue'
import YouTubePlayer from '@/components/YouTubePlayer.vue'
import { usePlaybackStateStore } from '@/stores/playbackState'

const playbackStateStore = usePlaybackStateStore()

function onReady() {
  console.log('YouTube player is ready')
  playbackStateStore.syncPlaybackState()
}
</script>

<style scoped lang="scss">
main {
  padding: 10px 0;
  height: 100vh;
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  #player {
    height: 60%;
    flex-grow: 1;

    @media (max-width: 768px) {
      height: auto;
      width: 100%;
    }
  }

  #chat {
    height: 60%;
    width: 460px;

    @media (max-width: 768px) {
      width: 100%;
      flex-grow: 1;
    }
  }
}
</style>

<template>
  <main>
    <YouTubePlayer id="player" @on-ready="onReady" />
    <ChatRoom id="chat" />
  </main>
</template>
