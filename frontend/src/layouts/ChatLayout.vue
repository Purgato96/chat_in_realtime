<template>
  <div class="flex flex-col h-screen bg-gray-50">

    <!-- Aqui exibe o título via prop do pai -->
    <header class="w-full p-4 border-b border-gray-300 bg-white shadow-sm">
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
    </header>

    <!-- Conteúdo principal scrollável -->
    <main class="flex-1 overflow-y-auto p-4">
      <slot/>
    </main>
  </div>
</template>

<script setup>
import {watch, onMounted} from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Chat',
  },
})

// Atualiza o título da aba do navegador
const setTitle = (title) => {
  document.title = title
}

onMounted(() => {
  setTitle(props.title)
})

watch(() => props.title, (newVal) => {
  setTitle(newVal)
})
</script>
