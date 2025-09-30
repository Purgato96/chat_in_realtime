import api from '../lib/axios.js';

export class AuthService {
  async login(credentials) {
    try {
      const {data} = await api.post('/auth/login', credentials);
      localStorage.setItem('chat_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(payload) {
    const {data} = await api.post('/auth/register', payload);
    // Se a API já retorna token e user:
    if (data?.access_token) {
      localStorage.setItem('chat_token', data.access_token);
    }
    if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async me() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Se falha, remove dados e redireciona
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  }

  async refresh() {
    try {
      const response = await api.post('/auth/refresh');
      const newToken = response.data.access_token;
      localStorage.setItem('chat_token', newToken);
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('chat_token');
    localStorage.removeItem('user');
    // Redirecionar para login se necessário
    window.location.href = '/login';
  }

  getToken() {
    return localStorage.getItem('chat_token');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Opcional: verificar se token não está expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
