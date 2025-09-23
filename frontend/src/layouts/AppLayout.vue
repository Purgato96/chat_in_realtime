<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white">
      <!-- Logo, navegação, etc. -->
      <slot name="sidebar"/>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header com breadcrumbs -->
      <header class="bg-white p-4 shadow">
        <nav class="text-sm text-gray-600">
          <router-link to="/">Home</router-link>
          <span v-for="(bc, i) in breadcrumbs" :key="i">
            <span class="mx-2">/</span>
            <router-link :to="bc.href">{{ bc.title }}</router-link>
          </span>
        </nav>
      </header>

      <!-- Conteúdo da página -->
      <main class="flex-1 overflow-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  breadcrumbs: { type: Array, default: () => [] }
})
</script>
