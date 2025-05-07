import mitt from 'mitt'
import type { PlaybackState } from './stores/playbackState'

type Events = {
  'sync-playback-state': PlaybackState
}

export const emitter = mitt<Events>()
