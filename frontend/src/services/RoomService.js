import api from '@/lib/axios';

export const RoomService = {
  async getAll() {
    const { data } = await api.get('/rooms');
    return data;
  },

  async getById(slug) {
    const { data } = await api.get(`/rooms/${slug}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/rooms', payload);
    return data;
  },

  async update(slug, payload) {
    const { data } = await api.put(`/rooms/${slug}`, payload);
    return data;
  },

  async delete(slug) {
    const { data } = await api.delete(`/rooms/${slug}`);
    return data;
  },

  async join(slug) {
    const { data } = await api.post(`/rooms/${slug}/join`);
    return data;
  },

  async leave(slug) {
    const { data } = await api.delete(`/rooms/${slug}/leave`);
    return data;
  },

  async getMembers(slug, params = {}) {
    const { data } = await api.get(`/rooms/${slug}/members`, { params });
    return data;
  },

  async getMyPrivateRooms() {
    const { data } = await api.get('/rooms/private/all');
    return data;
  }
};
