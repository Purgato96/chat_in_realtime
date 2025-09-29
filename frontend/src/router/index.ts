import { createRouter, createWebHistory } from 'vue-router'

// Importando páginas principais
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'
import Welcome from '@/views/Welcome.vue'
import Dashboard from '@/views/Admin/Dashboard.vue'

// Importando views do chat
import ChatIndex from '@/views/Chat/Index.vue'
import Room from '@/views/Chat/Room.vue'

const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  {
    path: '/chat',
    name: 'chat-index',
    component: ChatIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/chat/room/:slug',
    name: 'chat-room',
    component: Room,
    meta: { requiresAuth: true },
  },

  // Rota logout para executar ação de logout e redirecionar para login
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('chat_token')
      // resetar store de auth se estiver usando
      next('/login')
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guarda global para roteamento baseado em autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('chat_token')
  const publicPages = ['/', '/login', '/register']

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (publicPages.includes(to.path) && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
