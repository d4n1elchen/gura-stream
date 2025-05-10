import { config } from '@/config'
import { type UserInfo } from '@common/types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDiscordStore = defineStore('discord', () => {
  const isLoggedIn = ref(false)
  const user = ref({} as UserInfo)
  const backend = axios.create({
    withCredentials: true,
    baseURL: config.backendUrl,
  })

  async function login(code: string) {
    try {
      const response = await backend.post('/login', { code })
      if (response.status === 200) {
        isLoggedIn.value = true
        await fetchUserInfo()
      }
    } catch (error) {
      console.error('Error during login:', error)
      isLoggedIn.value = false
    }
  }

  async function fetchUserInfo() {
    try {
      const response = await backend.post<UserInfo>('/user')
      isLoggedIn.value = true
      console.log('User info:', response.data)
      user.value = response.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      user.value = {} as UserInfo
    }
  }

  return { isLoggedIn, user, login, fetchUserInfo }
})
