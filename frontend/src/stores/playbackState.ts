import { emitter } from '@/event'
import { socket } from '@/socket'
import type { PlaybackState } from '@common/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlaybackStateStore = defineStore('playback-state', () => {
  const initVideoId = ref('dBK0gKW61NU')
  const initTime = ref(220)

  function bindEvents() {
    socket.on('init-playback-state', (state: PlaybackState) => {
      console.log('init-playback-state', state)
      initVideoId.value = state.videoId
      initTime.value = state.time
    })

    socket.on('update-playback-state', (state: PlaybackState) => {
      console.log('update-playback-state', state)
      emitter.emit('sync-playback-state', state)
    })
  }

  function syncPlaybackState() {
    socket.emit('sync-playback-state')
  }

  return { initVideoId, initTime, bindEvents, syncPlaybackState }
})
