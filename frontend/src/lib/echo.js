import api from 'axios'; // aqui seria seu axios.js (token Bearer)
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export default new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsHost: `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
  wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel, options) => ({
    authorize: (socketId, callback) => {
      const token = localStorage.getItem('chat_token');
      api.post('/broadcasting/auth', {
        socket_id: socketId,
        channel_name: channel.name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => callback(false, response.data))
      .catch(error => callback(true, error));
    }
  }),
});
