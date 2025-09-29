import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import { initializeTheme } from '@/composables/useAppearance';

// CSS principal
import '@/assets/main.css';

// Inicializa tema antes da aplicação
initializeTheme();

const app = createApp(App);

app.use(router);

app.mount('#app');
