<script setup lang="ts">
import YouTubePlayer from '@/components/YouTubePlayer.vue'
import { usePlaybackStateStore } from '@/stores/playbackState'

const playbackStateStore = usePlaybackStateStore()
</script>

<template>
  <main>
    <YouTubePlayer
      :init-video-id="playbackStateStore.initVideoId"
      :init-time="playbackStateStore.initTime"
    />
  </main>
</template>
