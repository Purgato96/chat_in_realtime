import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import { initializeTheme } from '@/composables/useAppearance';
import { useAuth } from '@/composables/useAuth';

// CSS principal
import '@/assets/main.css';

// Inicializa tema antes da aplicação
initializeTheme();

const app = createApp(App);

// Carrega usuário ao iniciar a app
const { loadUser } = useAuth();
loadUser().then(() => {
  app.use(router);
  app.mount('#app');
});
