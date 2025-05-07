<script setup lang="ts">
import { emitter } from '@/event'
import { type PlaybackState } from '@/stores/playbackState'
import { useTemplateRef } from 'vue'
import YouTube from 'vue3-youtube'

const props = defineProps({
  initVideoId: {
    type: String,
    default: 'dBK0gKW61NU',
  },
  initTime: {
    type: Number,
    default: 0,
  },
})

const player = useTemplateRef('player')

function updatePlaybackState(state: PlaybackState) {
  const videoURL = `https://youtube.com/?v=${state.videoId}`
  const time = state.time
  if (player.value) {
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
      updatePlaybackState(state)
    })
  }
}
</script>

<template>
  <YouTube
    :src="`https://www.youtube.com/watch?v=${props.initVideoId}`"
    @ready="onReady"
    ref="player"
    :vars="{ start: props.initTime }"
  />
</template>
