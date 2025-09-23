<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-black p-6">
    <div class="w-full max-w-sm space-y-8 bg-transparent">
      <div class="flex flex-col items-center gap-4 mb-8">
        <!-- Logo central opcional -->
        <span class="text-xs text-slate-400 mb-2">INTERACTI</span>
        <h1 class="text-2xl font-bold text-white">Log in to your account</h1>
        <p class="text-base text-gray-300">Enter your email and password below to log in</p>
      </div>
      <form @submit.prevent="submit" class="flex flex-col gap-6">
        <div>
          <label for="email" class="block text-white text-sm mb-1">Email address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-md border border-gray-600 bg-black text-white px-3 py-2"
            placeholder="email@example.com"
          />
          <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
        </div>
        <div>
          <div class="flex justify-between items-center">
            <label for="password" class="block text-white text-sm mb-1">Password</label>
            <a href="#" class="text-xs text-gray-400 hover:underline">Forgot password?</a>
          </div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full rounded-md border border-gray-600 bg-black text-white px-3 py-2"
            placeholder="Password"
          />
          <div v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
        </div>
        <div class="flex gap-2 items-center">
          <input type="checkbox" v-model="form.remember" id="remember" class="form-checkbox" />
          <label for="remember" class="text-gray-200 text-sm">Remember me</label>
        </div>
        <button
          type="submit"
          :disabled="processing"
          class="w-full py-2 rounded-md text-black font-semibold bg-white hover:bg-gray-200 transition disabled:bg-gray-700 disabled:text-gray-400"
        >
          {{ processing ? 'Log in...' : 'Log in' }}
        </button>
        <div v-if="errorMessage" class="text-center text-red-400 mt-2 text-xs">{{ errorMessage }}</div>
      </form>
      <div class="text-center text-white text-sm mt-6">
        Don't have an account?
        <router-link to="/register" class="text-blue-400 hover:underline">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import authAxios from "@/lib/axios-auth.js";



const router = useRouter()
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({})
const errorMessage = ref('')
const processing = ref(false)

async function submit() {
  processing.value = true
  errorMessage.value = ''
  Object.keys(errors).forEach(k => delete errors[k])
  try {
    await authAxios.get('/sanctum/csrf-cookie')
    const res = await authAxiosaxios.post('/auth/login', {...form})
    if (res.data.success) {
      localStorage.setItem('chat_token', res.data.token)
      router.push('/admin')
    } else {
      errorMessage.value = res.data.message || 'Login failed'
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
