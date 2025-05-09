import type { PlaybackState } from '@common/types'

export type VideoInfo = {
  id: string
  length: number
  title: string
  timestamp: number
}

export type PlayerState = {
  playlist: VideoInfo[]
  currentVideoIndex: number
  currentTime: number
}

// Simulate a YouTube video player
export class SimPlayer {
  playlist: VideoInfo[] = []
  currentVideoIndex: number = 0
  currentTime: number = 0
  onUpdate: (state: PlayerState) => void
  onNext: (state: PlaybackState) => void
  playerIntervalId: NodeJS.Timeout | null = null

  constructor(
    initState: PlayerState,
    onUpdate: (state: PlayerState) => void,
    onNext: (state: PlaybackState) => void
  ) {
    this.playlist = initState.playlist
    this.currentVideoIndex = initState.currentVideoIndex
    this.currentTime = initState.currentTime
    this.onUpdate = onUpdate
    this.onNext = onNext
  }

  toPlaybackState(): PlaybackState {
    return {
      videoId: this.playlist[this.currentVideoIndex].id,
      time: this.currentTime,
    }
  }

  toPlayerState(): PlayerState {
    return {
      playlist: this.playlist,
      currentVideoIndex: this.currentVideoIndex,
      currentTime: this.currentTime,
    }
  }

  play() {
    this.playerIntervalId = setInterval(() => {
      this.currentTime++

      if (this.currentTime >= this.playlist[this.currentVideoIndex].length) {
        this.stop()

        setTimeout(() => {
          this.currentVideoIndex++
          if (this.currentVideoIndex >= this.playlist.length) {
            this.currentVideoIndex = 0
          }
          this.currentTime = 0
          this.onNext(this.toPlaybackState())
          this.onUpdate(this.toPlayerState())
          this.play()
        }, 3000)
      }

      this.onUpdate(this.toPlayerState())
    }, 1000)
  }

  stop() {
    if (this.playerIntervalId) {
      clearInterval(this.playerIntervalId)
      this.playerIntervalId = null
    }
  }
}
