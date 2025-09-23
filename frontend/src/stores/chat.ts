import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export const useChatStore = defineStore('chat', () => {
  const currentRoom = ref(null)
  const rooms = ref([])
  const messages = ref([])
  const privateConversations = ref([])
  const currentPrivateConversation = ref(null)
  const privateMessages = ref([])
  const isLoading = ref(false)

  const roomMessages = computed(() => {
    return messages.value.filter(m => m.room_id === currentRoom.value?.id)
  })

  const setCurrentRoom = (room) => {
    currentRoom.value = room
    messages.value = []
  }

  const addMessage = (message) => {
    messages.value.push(message)
  }

  const loadRoom = async (roomSlug) => {
    isLoading.value = true
    try {
      const response = await api.get(`/rooms/${roomSlug}`)
      if (response.data.success) {
        setCurrentRoom(response.data.data)
        await loadMessages(roomSlug)
        return { success: true, room: response.data.data }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao carregar sala' }
    } finally {
      isLoading.value = false
    }
  }

  const loadMessages = async (roomSlug, page = 1) => {
    try {
      const response = await api.get(`/rooms/${roomSlug}/messages?page=${page}`)
      if (response.data.success) {
        if (page === 1) {
          messages.value = response.data.data
        } else {
          messages.value.unshift(...response.data.data)
        }
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao carregar mensagens' }
    }
  }

  const sendMessage = async (roomSlug, content) => {
    try {
      const response = await api.post(`/rooms/${roomSlug}/messages`, { content })
      if (response.data.success) {
        addMessage(response.data.data)
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao enviar mensagem' }
    }
  }

  const joinRoom = async (roomSlug) => {
    try {
      const response = await api.post(`/rooms/${roomSlug}/join`)
      return { success: response.data.success, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao entrar na sala' }
    }
  }

  return {
    currentRoom,
    rooms,
    messages,
    privateConversations,
    currentPrivateConversation,
    privateMessages,
    isLoading,
    roomMessages,
    setCurrentRoom,
    addMessage,
    loadRoom,
    loadMessages,
    sendMessage,
    joinRoom
  }
})
