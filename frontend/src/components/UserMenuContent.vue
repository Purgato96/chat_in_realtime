<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { User } from '@/types';
import { useRouter } from 'vue-router';
import { LogOut, Settings } from 'lucide-vue-next';
import axios from 'axios';

interface Props {
  user: User;
}

defineProps<Props>();

const router = useRouter();

const handleLogout = async () => {
  try {
    await axios.post('/logout', null, { withCredentials: true });
    // Redireciona para página de login após logout
    router.push('/login');
  } catch (error) {
    console.error('Erro ao fazer logout', error);
  }
};
</script>

<template>
  <DropdownMenuLabel class="p-0 font-normal">
    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <UserInfo :user="user" :show-email="true" />
    </div>
  </DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuGroup>
    <DropdownMenuItem :as-child="true">
      <router-link class="block w-full" to="/profile/edit">
        <Settings class="mr-2 h-4 w-4" />
        Settings
      </router-link>
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem :as-child="true">
    <button class="block w-full text-left" @click="handleLogout">
      <LogOut class="mr-2 h-4 w-4" />
      Log out
    </button>
  </DropdownMenuItem>
</template>
