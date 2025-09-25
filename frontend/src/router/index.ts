import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      redirect: '/Welcome'
    },

  ],
})
// Guard para verificar autenticação se necessário
router.beforeEach((to, from, next) => {
  // Lógica de autenticação pode ser adicionada aqui
  next()
})

export default router
