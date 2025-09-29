<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import api from '@/lib/axios.js'  // axios configurado para sua API

const props = defineProps({
  rooms: Array
})

const router = useRouter()
const showCreateModal = ref(false)
const processing = ref(false)

const form = reactive({
  name: '',
  description: '',
  is_private: false
})

const createRoom = async () => {
  processing.value = true
  try {
    const response = await api.post('/v1/rooms', form)
    // Fecha o modal e limpa form ao criar com sucesso
    showCreateModal.value = false
    form.name = ''
    form.description = ''
    form.is_private = false

    // Atualiza lista de salas, por exemplo você pode emitir evento ou atualizar chamando API
    router.go(0) // simples recarregar a página/rota
  } catch (error) {
    // Trate error aqui como quiser, por exemplo alert
    alert('Erro ao criar sala: ' + (error.response?.data.message || error.message))
  } finally {
    processing.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToRoom = (slug) => {
  router.push({ name: 'chat-room', params: { slug } })
}
</script>

<template>
  <AppLayout title="Chat">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Chat
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-6">
            <!-- Header com botão para criar sala -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Suas Salas de Chat</h3>
              <button
                @click="showCreateModal = true"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Nova Sala
              </button>
            </div>

            <!-- Lista de salas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="room in rooms"
                :key="room.id"
                class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                @click="goToRoom(room.slug)"
              >
                <h4 class="font-semibold text-gray-900 mb-2">{{ room.name }}</h4>
                <p class="text-gray-600 text-sm mb-3">{{ room.description || 'Sem descrição' }}</p>

                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>{{ room.users_count || 0 }} membros</span>
                  <span v-if="room.latest_messages?.length">
                    Última mensagem: {{ formatDate(room.latest_messages[0].created_at) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Estado vazio -->
            <template v-if="rooms.length === 0">
              <div class="text-center py-12">
                <div class="text-gray-500 mb-4">
                  <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.003-4.165L2 20l4.165-4.003A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma sala encontrada</h3>
                <p class="text-gray-500 mb-4">Crie sua primeira sala de chat para começar.</p>
                <button
                  @click="showCreateModal = true"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Criar Primeira Sala
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para criar sala -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Criar Nova Sala</h3>

          <form @submit.prevent="createRoom">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Nome da Sala
              </label>
              <input
                v-model="form.name"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Descrição (opcional)
              </label>
              <textarea
                v-model="form.description"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea>
            </div>

            <div class="mb-6">
              <label class="flex items-center">
                <input
                  v-model="form.is_private"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-blue-600"
                >
                <span class="ml-2 text-gray-700">Sala privada</span>
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="processing"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {{ processing ? 'Criando...' : 'Criar Sala' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
