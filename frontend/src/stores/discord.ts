import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDiscordStore = defineStore('discord', () => {
  const isLoggedIn = ref(false)
  const userId = ref('')
})
