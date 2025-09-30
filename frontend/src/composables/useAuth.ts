import {ref, computed} from 'vue';
import {authService as AuthService} from '@/services/AuthService';

const user = ref(null);
const token = ref(null);
const isLoading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => AuthService.isAuthenticated());

  const loadUser = async () => {
    if (!AuthService.isAuthenticated()) {
      user.value = null;
      return;
    }
    isLoading.value = true;
    try {
      const userData = await AuthService.me();
      user.value = userData;
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    isLoading.value = true;
    try {
      const data = await AuthService.login(credentials);
      token.value = data.access_token ?? null;
      // busca perfil para popular user
      try {
        const me = await AuthService.me();
        user.value = me;
      } catch {
        user.value = null;
      }
      return data;
    } finally {
      isLoading.value = false;
    }
  };


  const register = async (payload) => {
    isLoading.value = true;
    try {
      const data = await AuthService.register(payload);
      if (data?.user) user.value = data.user;
      if (data?.access_token) token.value = data.access_token;
      return data;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    AuthService.logout();
    user.value = null;
    token.value = null;
  };

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    loadUser,
    login,
    register,
    logout,
  };
}
