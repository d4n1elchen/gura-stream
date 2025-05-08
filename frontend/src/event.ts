import type { PlaybackState } from '@common/types'
import mitt from 'mitt'

type Events = {
  'sync-playback-state': PlaybackState
}

export const emitter = mitt<Events>()
