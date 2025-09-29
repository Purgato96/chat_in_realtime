<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Conteúdo principal -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Chat',
  },
})

// Atualiza título da página ao montar e ao alterar prop
const setTitle = (title) => {
  document.title = title
}

onMounted(() => {
  setTitle(props.title)
})

// Para garantir atualização caso prop title mude dinamicamente
watch(() => props.title, (newVal) => {
  setTitle(newVal)
})
</script>
