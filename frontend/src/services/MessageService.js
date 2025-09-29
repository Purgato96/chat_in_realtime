import api from '@/lib/axios';

export const MessageService = {
  async getRoomMessages(roomSlug, params = {}) {
    const { data } = await api.get(`/rooms/${roomSlug}/messages`, { params });
    return data;
  },

  async sendRoomMessage(roomSlug, content) {
    const { data } = await api.post(`/rooms/${roomSlug}/messages`, { content });
    return data;
  },

  async getById(messageId) {
    const { data } = await api.get(`/messages/${messageId}`);
    return data;
  },

  async update(messageId, content) {
    const { data } = await api.put(`/messages/${messageId}`, { content });
    return data;
  },

  async delete(messageId) {
    const { data } = await api.delete(`/messages/${messageId}`);
    return data;
  },

  async search(roomSlug, query, params = {}) {
    const { data } = await api.get(`/rooms/${roomSlug}/messages/search`, {
      params: { q: query, ...params }
    });
    return data;
  }
};
