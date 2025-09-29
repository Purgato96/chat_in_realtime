import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: false, // JWT via header, não cookies
});

// Flag para evitar loops infinitos no refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para incluir token Bearer em cada requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem('chat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para tratar respostas e refresh automático
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Se o token expirou (401) e não é uma tentativa de login/register
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não tenta refresh em rotas de login/register
      if (originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.token;

        localStorage.setItem('chat_token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Remove token inválido e redireciona para login
        localStorage.removeItem('chat_token');
        delete api.defaults.headers.common['Authorization'];

        // Redirecionar para login se estivermos no browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
