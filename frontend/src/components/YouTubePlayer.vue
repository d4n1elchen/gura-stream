<script setup lang="ts">
import { emitter } from '@/event'
import { type PlaybackState } from '@common/types'
import { useTemplateRef } from 'vue'
import YouTube from 'vue3-youtube'

const props = defineProps({
  initVideoId: {
    type: String,
    default: 'dBK0gKW61NU',
  },
  initTime: {
    type: Number,
    default: 220,
  },
})

const player = useTemplateRef('player')

function updatePlaybackState(state: PlaybackState) {
  if (!state.videoId) {
    console.warn('No video ID provided in playback state')
    return
  }
  const videoURL = `https://youtube.com/?v=${state.videoId}`
  const time = state.time
  if (player.value?.ready) {
    if (player.value.getVideoUrl() !== videoURL) {
      player.value.loadVideoById(state.videoId, time)
    } else {
      player.value.seekTo(time, true)
    }
  }
}

function onReady() {
  if (player.value) {
    player.value.mute()
    player.value.playVideo()
    emitter.on('sync-playback-state', (state: PlaybackState) => {
      const maxRetries = 3
      let retries = 0
      const interval = setInterval(() => {
        if (retries >= maxRetries) {
          clearInterval(interval)
          return
        }
        retries++
        try {
          updatePlaybackState(state)
          clearInterval(interval)
        } catch (error) {
          console.warn('Error updating playback state: ', error)
          console.warn('Retrying in 1 second...')
        }
      }, 1000)
    })
  }
}
</script>

<style scoped lang="scss">
:deep(iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <YouTube
    :src="`https://www.youtube.com/watch?v=${props.initVideoId}`"
    @ready="onReady"
    ref="player"
    :vars="{ start: props.initTime }"
    width="100%"
    height="100%"
  />
</template>
