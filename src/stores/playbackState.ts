import { emitter } from '@/event'
import { socket } from '@/socket'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type PlaybackState = {
  videoId: string
  time: number
}

export const usePlaybackStateStore = defineStore('playback-state', () => {
  const initVideoId = ref('')
  const initTime = ref(0)

  function bindEvents() {
    socket.on('init-playback-state', (state: PlaybackState) => {
      initVideoId.value = state.videoId
      initTime.value = state.time
    })

    socket.on('update-playback-state', (state: PlaybackState) => {
      emitter.emit('sync-playback-state', state)
    })
  }

  function syncPlaybackState() {
    socket.emit('sync-playback-state')
  }

  return { initVideoId, initTime, bindEvents, syncPlaybackState }
})
