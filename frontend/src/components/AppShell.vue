<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar';

interface Props {
  variant?: 'header' | 'sidebar';
  sidebarOpen?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.variant === 'header'" class="flex min-h-screen w-full flex-col">
    <slot />
  </div>
  <SidebarProvider v-else :default-open="props.sidebarOpen ?? false">
    <slot />
  </SidebarProvider>
</template>
