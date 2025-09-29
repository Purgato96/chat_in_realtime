<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { register, loading } = useAuth();
const router = useRouter();
const error = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const handleSubmit = async () => {
  error.value = '';

  if (form.password !== form.password_confirmation) {
    error.value = 'As senhas não coincidem';
    return;
  }

  try {
    await register(form);
    router.push('/chat');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao criar conta';
    console.error('Erro no registro:', err);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Registre-se para começar a usar o chat
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Seu nome completo"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="seu@email.com"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              name="password_confirmation"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              :disabled="loading"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </div>

        <div class="text-center">
          <span class="text-sm text-gray-600">Já tem conta? </span>
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Entrar
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
