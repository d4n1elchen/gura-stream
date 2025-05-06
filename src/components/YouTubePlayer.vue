<script setup lang="ts">
import { useTemplateRef } from 'vue'
import YouTube from 'vue3-youtube'

const props = defineProps({
  videoId: {
    type: String,
    default: 'jNQXAC9IVRw',
  },
  startSeconds: {
    type: Number,
    default: 0,
  },
})

const player = useTemplateRef('player')

function onReady() {
  if (player.value) {
    player.value.mute()
    player.value.seekTo(props.startSeconds, true)
    player.value.playVideo()
  }
}
</script>

<template>
  <YouTube
    :src="`https://www.youtube.com/watch?v=${props.videoId}`"
    @ready="onReady"
    ref="player"
  />
</template>
