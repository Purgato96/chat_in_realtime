import {ref, computed} from 'vue'
import {RoomService} from '@/services'

const rooms = ref([])
const loading = ref(false)
const currentRoom = ref(null)

export function useRooms() {
  const fetchRooms = async () => {
    loading.value = true
    try {
      const data = await RoomService.getAll()
      // se data é { data: [...], meta: ... } pegue o array
      rooms.value = Array.isArray(data) ? data : (data.data || [])
    } catch (error) {
      console.error('Erro ao carregar salas:', error)
      rooms.value = [] // fallback
    } finally {
      loading.value = false
    }
  }

  const fetchRoomBySlug = async (slug) => {
  loading.value = true;
  try {
    const response = await RoomService.getById(slug);
    currentRoom.value = response.data || response;
    return currentRoom.value;
  } catch (error) {
    if (error.response?.status === 403) {
      alert('Você não tem permissão para acessar essa sala.');
      // Opcional: redirecionar, limpar estado ou exibir mensagem customizada
      currentRoom.value = null;
    }
    throw error;
  } finally {
    loading.value = false;
  }
};


  const createRoom = async (payload: any) => {
    loading.value = true
    try {
      const data = await RoomService.create(payload)
      // Se backend retorna { data: room, ... }
      const newRoom = data.data ? data.data : data
      if (!Array.isArray(rooms.value)) {
        rooms.value = []
      }
      rooms.value.unshift(newRoom)
      return newRoom
    } catch (error) {
      console.error('Erro ao criar sala:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateRoom = async (slug: string, payload: any) => {
    loading.value = true
    try {
      const data = await RoomService.update(slug, payload)
      const index = rooms.value.findIndex(r => r.slug === slug)
      if (index !== -1) rooms.value[index] = data
      if (currentRoom.value?.slug === slug) currentRoom.value = data
      return data
    } catch (error) {
      console.error('Erro ao atualizar sala:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteRoom = async (slug: string) => {
    loading.value = true
    try {
      await RoomService.delete(slug)
      rooms.value = rooms.value.filter(r => r.slug !== slug)
      if (currentRoom.value?.slug === slug) currentRoom.value = null
    } catch (error) {
      console.error('Erro ao deletar sala:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const joinRoom = async (slug: string) => {
    try {
      await RoomService.join(slug)
      await fetchRooms() // Refresh after join
    } catch (error) {
      console.error('Erro ao entrar na sala:', error)
      throw error
    }
  }

  const leaveRoom = async (slug: string) => {
    try {
      await RoomService.leave(slug)
      await fetchRooms() // Refresh after leave
    } catch (error) {
      console.error('Erro ao sair da sala:', error)
      throw error
    }
  }

  const getMembers = async (slug: string, params = {}) => {
    try {
      return await RoomService.getMembers(slug, params)
    } catch (error) {
      console.error('Erro ao obter membros:', error)
      throw error
    }
  }

  const getMyPrivateRooms = async () => {
    try {
      const data = await RoomService.getMyPrivateRooms()
      return data
    } catch (error) {
      console.error('Erro ao obter salas privadas:', error)
      throw error
    }
  }

  return {
    rooms,
    loading,
    currentRoom,
    fetchRooms,
    fetchRoomBySlug,
    createRoom,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    getMembers,
    getMyPrivateRooms,
  }
}
