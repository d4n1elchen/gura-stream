export type UserInfo = {
  id: string
  username: string
  avatar: string
  roles: string[]
}

export type ChatMessage = {
  user: UserInfo
  message: string
}

export type PlaybackState = {
  videoId: string
  time: number
}
