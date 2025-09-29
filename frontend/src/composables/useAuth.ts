import { ref, computed } from 'vue';
import { AuthService } from '@/services';

const user = ref(null);
const loading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials) => {
    loading.value = true;
    try {
      const data = await AuthService.login(credentials);
      user.value = data.user;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    loading.value = true;
    try {
      const data = await AuthService.register(payload);
      user.value = data.user;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await AuthService.logout();
    } catch (error) {
      // Ignora erro 401, que indica token expirado ou inválido
      if (error.response?.status !== 401) {
        throw error;
      }
    } finally {
      user.value = null;
      localStorage.removeItem('chat_token');
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    loading.value = true;
    try {
      user.value = await AuthService.me();
      return user.value;
    } catch (error) {
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const autoLogin = async (email, accountId) => {
    loading.value = true;
    try {
      const data = await AuthService.autoLogin(email, accountId);
      user.value = data.data.user;
      return data;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    autoLogin,
  };
}
