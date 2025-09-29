<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-black p-6">
    <div class="max-w-sm w-full space-y-8 bg-transparent">
      <h1 class="text-2xl font-bold text-white mb-2">Log in to your account</h1>
      <form @submit.prevent="submit" class="flex flex-col gap-6">
        <div>
          <label for="email" class="text-white text-sm mb-1 block">Email address</label>
          <input id="email" v-model="form.email" type="email" required class="w-full rounded-md border border-gray-600 bg-black text-white px-3 py-2" placeholder="email@example.com"/>
          <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
        </div>
        <div>
          <label for="password" class="text-white text-sm mb-1 block">Password</label>
          <input id="password" v-model="form.password" type="password" required class="w-full rounded-md border border-gray-600 bg-black text-white px-3 py-2" placeholder="Password"/>
          <div v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
        </div>
        <button type="submit" :disabled="processing" class="w-full py-2 rounded-md text-black font-semibold bg-white hover:bg-gray-200 transition disabled:bg-gray-700 disabled:text-gray-400">
          {{ processing ? "Log in..." : "Log in" }}
        </button>
        <div v-if="errorMessage" class="text-center text-red-400 mt-2 text-xs">{{ errorMessage }}</div>
      </form>
      <p class="text-center text-white text-sm mt-6">
        Don't have an account? <router-link to="/register" class="text-blue-400 hover:underline">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios.js' // axios com interceptor token Bearer

const router = useRouter()
const form = reactive({ email: '', password: '', remember: false })
const errors = reactive({})
const errorMessage = ref('')
const processing = ref(false)

async function submit() {
  processing.value = true
  errorMessage.value = ''
  Object.keys(errors).forEach(k => delete errors[k])
  try {
    const res = await api.post('/auth/login', {
      email: form.email,
      password: form.password,
      device_name: 'web',
    })
    if (res.data.token) {
      localStorage.setItem('chat_token', res.data.token)
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Login failed'
    }
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors || {})
    } else {
      errorMessage.value = err.response?.data?.message || 'Unexpected error'
    }
  } finally {
    processing.value = false
  }
}
</script>
