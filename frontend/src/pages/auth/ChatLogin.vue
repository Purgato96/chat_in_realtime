<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/lib/axios';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const email = route.query.email as string;
  const account_id = route.query.account_id as string;

  if (!email || !account_id || email === '{{Email}}') {
    alert('Parâmetros inválidos de auto-login.');
    return router.replace('/login');
  }

  try {
    const { data } = await api.post('/auth/auto-login', { email, account_id });
    if (!data?.token) throw new Error('Token ausente');

    localStorage.setItem('chat_token', data.token);
    if (data?.data?.user) localStorage.setItem('user', JSON.stringify(data.data.user));

    const go = data?.data?.redirect_to || '/chat';
    router.replace(go);
  } catch (e) {
    console.error('Auto-login falhou', e);
    alert('Não foi possível realizar o auto-login.');
    router.replace('/login');
  }
});
</script>

<template>
  <div class="p-8 text-center text-gray-700">Conectando ao chat...</div>
</template>
