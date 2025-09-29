import api from '@/lib/axios';

export const AuthService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('chat_token', data.token);
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('chat_token', data.token);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('chat_token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async refresh() {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('chat_token', data.token);
    return data;
  },

  async autoLogin(email, accountId) {
    const { data } = await api.post('/auth/auto-login', {
      email,
      account_id: accountId
    });

    if (data.token) {
      localStorage.setItem('chat_token', data.token);
    }

    return data;
  }
};
