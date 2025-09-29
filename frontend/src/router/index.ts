import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '@/services';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import Welcome from '@/views/Welcome.vue';
import ChatIndex from '@/views/Chat/Index.vue';
import ChatRoom from '@/views/Chat/Room.vue';
import Dashboard from "@/views/Admin/Dashboard.vue";

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: Welcome,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/chat',
    name: 'chat-index',
    component: ChatIndex,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/room/:slug',
    name: 'chat-room',
    component: ChatRoom,
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: async (to, from, next) => {
      await AuthService.logout();
      next('/login');
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guarda global para validar autenticação real
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('chat_token');

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login');
    }
    try {
      await AuthService.me(); // verifica se token é válido
      return next();
    } catch (error) {
      localStorage.removeItem('chat_token');
      return next('/login');
    }
  }

  if (to.meta.requiresGuest && token) {
    try {
      await AuthService.me();
      return next('/chat');
    } catch {
      localStorage.removeItem('chat_token');
      return next();
    }
  }

  return next();
});

export default router;
