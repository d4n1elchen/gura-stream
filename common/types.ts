export type UserInfo = {
  id: string
  username: string
  avatar: string
}

export type ChatMessage = {
  user: UserInfo
  message: string
}

export type PlaybackState = {
  videoId: string
  time: number
}
