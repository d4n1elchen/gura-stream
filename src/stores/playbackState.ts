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

  const updatedVideoId = ref('')
  const updatedTime = ref(0)

  function bindEvents() {
    socket.on('init-playback-state', (state: PlaybackState) => {
      console.log('init-playback-state', state)
      initVideoId.value = state.videoId
      initTime.value = state.time
    })

    socket.on('update-playback-state', (state: PlaybackState) => {
      console.log('update-playback-state', state)
      updatedVideoId.value = state.videoId
      updatedTime.value = state.time
    })
  }

  function syncPlaybackState() {
    socket.emit('sync-playback-state')
  }

  return { initVideoId, initTime, bindEvents, syncPlaybackState }
})
