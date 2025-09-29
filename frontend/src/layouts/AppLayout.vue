<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAppearance } from '@/composables/useAppearance';

const { user, fetchUser } = useAuth();
const { appearance, updateAppearance } = useAppearance();

defineProps({
  title: {
    type: String,
    default: ''
  }
});

// Busca usuário logado se tiver token
onMounted(async () => {
  const token = localStorage.getItem('chat_token');
  if (token && !user.value) {
    try {
      await fetchUser();
    } catch (error) {
      // Token inválido, axios interceptor vai redirecionar
      console.error('Erro ao buscar usuário:', error);
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">LVT Chat</h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button
              @click="updateAppearance(appearance === 'dark' ? 'light' : 'dark')"
              class="p-2 rounded-md text-gray-500 hover:text-gray-700"
            >
              {{ appearance === 'dark' ? '☀️' : '🌙' }}
            </button>

            <!-- User info -->
            <div v-if="user" class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">{{ user.name }}</span>
              <router-link to="/logout" class="text-sm text-red-600 hover:text-red-800">
                Sair
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
