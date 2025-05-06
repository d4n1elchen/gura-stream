<script setup lang="ts">
import { useTemplateRef } from 'vue'
import YouTube from 'vue3-youtube'

const props = defineProps({
  initVideoId: {
    type: String,
    default: '',
  },
  initTime: {
    type: Number,
    default: 0,
  },
})

const player = useTemplateRef('player')

function onReady() {
  if (player.value) {
    player.value.mute()
    player.value.playVideo()
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
