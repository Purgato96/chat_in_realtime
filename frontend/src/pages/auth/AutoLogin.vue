<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          {{ loading ? 'Conectando...' : 'Chat Real-time' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ statusMessage }}
        </p>
      </div>

      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="text-red-800">
          <h3 class="font-medium">Erro na autenticação</h3>
          <p class="text-sm mt-1">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const statusMessage = ref('Processando autenticação automática...')

onMounted(async () => {
  const email = route.query.email
  const accountId = route.query.account_id

  if (!email || !accountId) {
    error.value = 'Parâmetros de autenticação ausentes'
    statusMessage.value = 'Erro: email ou account_id não fornecidos'
    loading.value = false
    return
  }

  if (email === '{{Email}}') {
    error.value = 'Email não foi substituído corretamente'
    statusMessage.value = 'Erro na configuração do iframe'
    loading.value = false
    return
  }

  try {
    statusMessage.value = 'Autenticando usuário...'
    const result = await authStore.autoLogin(email, accountId)

    if (result.success) {
      statusMessage.value = 'Autenticação bem-sucedida! Redirecionando...'

      // Redirecionar para a sala do usuário
      const roomSlug = result.data.room.slug
      setTimeout(() => {
        router.push(`/chat/${roomSlug}`)
      }, 1000)
    } else {
      error.value = result.message
      statusMessage.value = 'Falha na autenticação'
    }
  } catch (err) {
    error.value = 'Erro inesperado durante a autenticação'
    statusMessage.value = 'Erro de conexão'
    console.error('Auto-login error:', err)
  } finally {
    loading.value = false
  }
})
</script>
