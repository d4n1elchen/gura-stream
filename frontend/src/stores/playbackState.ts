import { emitter } from '@/event'
import { socket } from '@/socket'
import type { PlaybackState } from '@common/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlaybackStateStore = defineStore('playback-state', () => {
  const initVideoId = ref('')
  const initTime = ref(0)

  function bindEvents() {
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
