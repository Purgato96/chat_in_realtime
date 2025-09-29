import api from '@/lib/axios';

export const PrivateConversationService = {
  async getAll() {
    const { data } = await api.get('/private-conversations');
    return data;
  },

  async getById(conversationId) {
    const { data } = await api.get(`/private-conversations/${conversationId}`);
    return data;
  },

  async start(userId) {
    const { data } = await api.post('/private-conversations', { user_id: userId });
    return data;
  }
};
