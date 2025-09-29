import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {ref, onUnmounted} from 'vue';

window.Pusher = Pusher;

const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
let echoInstance: Echo | null = null;

export function useWebSocket() {
  const connect = () => {
    const token = localStorage.getItem('chat_token');
    if (!token) return null;

    connectionStatus.value = 'connecting';

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
      authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {Authorization: `Bearer ${token}`, Accept: 'application/json'},
      },
    });

    // Acesse a instância Pusher para ouvir mudanças de conexão
    const pusher = (echoInstance.connector.pusher as Pusher);

    // 'connected' dispara quando STATE muda para 'connected'
    pusher.connection.bind('connected', () => {
      connectionStatus.value = 'connected';
    });

    // 'error' para erros genéricos; também útil ouvir 'failed' e 'unavailable'
    pusher.connection.bind('error', () => {
      connectionStatus.value = 'error';
    });
    pusher.connection.bind('failed', () => {
      connectionStatus.value = 'error';
    });
    pusher.connection.bind('unavailable', () => {
      connectionStatus.value = 'error';
    });

    return echoInstance;
  };

  const disconnect = () => {
    if (echoInstance) {
      // Desvincule handlers de conexão para evitar leaks
      const pusher = (echoInstance.connector?.pusher as Pusher | undefined);
      if (pusher) {
        pusher.connection.unbind('connected');
        pusher.connection.unbind('error');
        pusher.connection.unbind('failed');
        pusher.connection.unbind('unavailable');
      }
      echoInstance.disconnect();
      echoInstance = null;
      connectionStatus.value = 'disconnected';
    }
  };

  const joinRoom = (roomSlug: string, handlers: {
    onMessageSent?: (event: any) => void;
    onMessageUpdated?: (event: any) => void;
    onMessageDeleted?: (event: any) => void;
  } = {}) => {
    if (!echoInstance) return null;
    // Remova o prefixo 'private-' ao usar Echo.private; Echo adiciona automaticamente
    const channel = echoInstance.private(`room.${roomSlug}`);
    if (handlers.onMessageSent) channel.listen('.message.sent', handlers.onMessageSent);
    if (handlers.onMessageUpdated) channel.listen('.message.updated', handlers.onMessageUpdated);
    if (handlers.onMessageDeleted) channel.listen('.message.deleted', handlers.onMessageDeleted);
    return channel;
  };

  const joinUserChannel = (userId: number, handlers: {
    onPrivateMessage?: (event: any) => void;
  } = {}) => {
    if (!echoInstance) return null;
    const channel = echoInstance.private(`user.${userId}`);
    if (handlers.onPrivateMessage) channel.listen('.private-message-sent', handlers.onPrivateMessage);
    return channel;
  };

  const leaveChannel = (channelName: string) => {
    if (echoInstance) echoInstance.leave(channelName);
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connectionStatus,
    connect,
    disconnect,
    joinRoom,
    joinUserChannel,
    leaveChannel,
  };
}
