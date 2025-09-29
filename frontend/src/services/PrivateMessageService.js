import api from '@/lib/axios';

export const PrivateMessageService = {
  async send(conversationId, content) {
    const { data } = await api.post(`/private-conversations/${conversationId}/messages`, { content });
    return data;
  },

  async update(conversationId, messageId, content) {
    const { data } = await api.put(`/private-conversations/${conversationId}/messages/${messageId}`, { content });
    return data;
  },

  async markAsRead(conversationId, messageId) {
    const { data } = await api.post(`/private-conversations/${conversationId}/messages/${messageId}/read`);
    return data;
  }
};
