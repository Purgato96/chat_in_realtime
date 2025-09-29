<template>
  <AuthBase
    title="Create an account"
    description="Enter your details below to register"
  >
    <form @submit.prevent="submit" class="flex flex-col gap-6">
      <div class="grid gap-6">
        <!-- Name -->
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input
            id="name"
            v-model="form.name"
            type="text"
            required
            autofocus
            :tabindex="1"
            autocomplete="name"
            placeholder="Full name"
          />
          <InputError :message="errors.name"/>
        </div>

        <!-- Email -->
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            required
            :tabindex="2"
            autocomplete="email"
            placeholder="email@example.com"
          />
          <InputError :message="errors.email"/>
        </div>

        <!-- Password -->
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            required
            :tabindex="3"
            autocomplete="new-password"
            placeholder="Password"
          />
          <InputError :message="errors.password"/>
        </div>

        <!-- Confirm Password -->
        <div class="grid gap-2">
          <Label for="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            required
            :tabindex="4"
            autocomplete="new-password"
            placeholder="Confirm password"
          />
          <InputError :message="errors.password_confirmation"/>
        </div>

        <!-- Submit -->
        <Button type="submit" class="mt-2 w-full" tabindex="5" :disabled="form.processing">
          <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin"/>
          Create account
        </Button>
      </div>

      <!-- Already have account -->
      <div class="text-center text-sm text-muted-foreground">
        Already have an account?
        <RouterLink
          :to="login"
          class="underline underline-offset-4"
          :tabindex="6"
        >
          Log in
        </RouterLink>
      </div>
    </form>
  </AuthBase>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter, RouterLink} from 'vue-router'
import api from '@/lib/axios.js' // axios configurado com token Bearer

// UI components do starter kit
import InputError from '@/components/InputError.vue'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import AuthBase from '@/layouts/AuthLayout.vue'
import {LoaderCircle} from 'lucide-vue-next'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive<Record<string, string>>({})
const errorMessage = ref('')
const processing = ref(false)
const login = '/login'

async function submit() {
  processing.value = true
  errorMessage.value = ''
  Object.keys(errors).forEach((k) => delete errors[k])

  try {
    const res = await api.post('/auth/register', {
      ...form,
      device_name: 'web',
    })

    if (res.status === 201) {
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Registration failed'
    }
  } catch (err: any) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors || {})
    } else {
      errorMessage.value =
        err.response?.data?.message || 'Unexpected error occurred'
    }
  } finally {
    processing.value = false
  }
}
</script>
