import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('chat_token');
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function processQueue(newToken) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const response = error && error.response;
    const original = (error && error.config) || {};

    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    const originalUrl = typeof original.url === 'string' ? original.url : '';
    if (originalUrl.indexOf('/auth/refresh') !== -1) {
      localStorage.removeItem('chat_token');
      localStorage.removeItem('user');
      try {
        window.Echo && window.Echo.disconnect && window.Echo.disconnect();
      } catch {
      }
      window.location.replace('/login');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((newToken) => {
          if (newToken) {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const {data} = await api.post('/auth/refresh');
      const newToken = (data && data.access_token) ? data.access_token : null;
      if (!newToken) throw new Error('No token on refresh');

      localStorage.setItem('chat_token', newToken);
      processQueue(newToken);

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      processQueue(null);
      localStorage.removeItem('chat_token');
      localStorage.removeItem('user');
      try {
        window.Echo && window.Echo.disconnect && window.Echo.disconnect();
      } catch {
      }
      window.location.replace('/login');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
