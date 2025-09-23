import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('chat_token'))
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('chat_token', newToken)
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('chat_token')
  }

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        return { success: true, data: response.data }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro no login' }
    }
  }

  const autoLogin = async (email, accountId) => {
    try {
      const response = await api.post('/chat/auto-login', {
        email,
        account_id: accountId
      })
      if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.data.user)
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro no auto-login' }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.log('Erro no logout:', error)
    } finally {
      clearAuth()
    }
  }

  const fetchUser = async () => {
    if (!token.value) return false

    try {
      const response = await api.get('/auth/me')
      if (response.data.success) {
        setUser(response.data.user)
        return true
      }
    } catch (error) {
      clearAuth()
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    autoLogin,
    logout,
    fetchUser,
    setUser,
    setToken,
    clearAuth
  }
})
