import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeTheme } from '@/composables/useAppearance'

import api from './lib/axios'
import echo from './lib/echo'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Opcional: fornecer api e echo via provide/inject ou globalProperties
app.config.globalProperties.$api = api
app.config.globalProperties.$echo = echo

app.use(createPinia())
app.use(router)

app.mount('#app')
initializeTheme()
