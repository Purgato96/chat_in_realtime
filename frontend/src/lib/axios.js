import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',  // URL da sua API
  withCredentials: false,                   // Bearer token, não cookies
});

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

export default api;
