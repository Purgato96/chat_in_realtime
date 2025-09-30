import { ref } from 'vue';
import { RoomService } from '@/services';

const rooms = ref<any[]>([]);
const loading = ref(false);
const currentRoom = ref<any | null>(null);

export function useRooms() {
  const fetchRooms = async () => {
    loading.value = true;
    try {
      const res = await RoomService.getAll(); // { data: [...], meta: {...} }
      rooms.value = Array.isArray(res?.data) ? res.data : [];
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      rooms.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchRoomBySlug = async (slug: string) => {
    loading.value = true;
    try {
      const res = await RoomService.getById(slug); // { data: {...} }
      currentRoom.value = res?.data ?? null;
      return currentRoom.value;
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Você não tem permissão para acessar essa sala.');
        currentRoom.value = null;
        return null;
      }
      if (error.response?.status === 404) {
        alert('Sala não encontrada.');
        currentRoom.value = null;
        return null;
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createRoom = async (payload: any) => {
    loading.value = true;
    try {
      const res = await RoomService.create(payload); // { data: room, message: ... }
      const newRoom = res?.data ?? res;
      rooms.value.unshift(newRoom);
      return newRoom;
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateRoom = async (slug: string, payload: any) => {
    loading.value = true;
    try {
      const res = await RoomService.update(slug, payload);
      const updated = res?.data ?? res;
      const idx = rooms.value.findIndex(r => r.slug === slug);
      if (idx !== -1) rooms.value[idx] = updated;
      if (currentRoom.value?.slug === slug) currentRoom.value = updated;
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteRoom = async (slug: string) => {
    loading.value = true;
    try {
      await RoomService.delete(slug);
      rooms.value = rooms.value.filter(r => r.slug !== slug);
      if (currentRoom.value?.slug === slug) currentRoom.value = null;
    } catch (error) {
      console.error('Erro ao deletar sala:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const joinRoom = async (slug: string) => {
    try {
      await RoomService.join(slug);
      await fetchRooms();
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      throw error;
    }
  };

  const leaveRoom = async (slug: string) => {
    try {
      await RoomService.leave(slug);
      await fetchRooms();
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
      throw error;
    }
  };

  const getMembers = async (slug: string, params: any = {}) => {
    try {
      return await RoomService.getMembers(slug, params);
    } catch (error) {
      console.error('Erro ao obter membros:', error);
      throw error;
    }
  };

  const getMyPrivateRooms = async () => {
    try {
      const res = await RoomService.getMyPrivateRooms(); // { data: [...] }
      return res?.data ?? [];
    } catch (error) {
      console.error('Erro ao obter salas privadas:', error);
      throw error;
    }
  };

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
  };
}
