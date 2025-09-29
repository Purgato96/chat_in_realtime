import api from '@/lib/axios';

export const WebSocketService = {
  async authenticate(socketId, channelName) {
    const { data } = await api.post('/websocket/auth', {
      socket_id: socketId,
      channel_name: channelName
    });
    return data;
  },

  async getChannels() {
    const { data } = await api.get('/websocket/channels');
    return data;
  },

  async test() {
    const { data } = await api.get('/websocket/test');
    return data;
  }
};
