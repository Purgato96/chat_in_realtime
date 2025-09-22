<template>
    <ChatLayout :title="`Sala: ${room.name}`">
        <div class="bg-blue-50 py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <!-- Header da sala -->
                    <div class="p-6 border-b border-gray-200">
                        <h2 class="text-2xl font-bold text-gray-900">
                            <span v-if="activeTab === 'public'">{{ room.name }}</span>
                            <span v-else-if="currentPrivateConversation">{{ currentPrivateConversation.other_user.name
                                }}</span>
                            <span v-else>Chat Privado</span>
                        </h2>
                        <p v-if="room.description && activeTab === 'public'" class="text-gray-600 mt-1">
                            {{ room.description }}</p>
                        <div class="flex items-center mt-2 space-x-4">
                            <span v-if="activeTab === 'public'" class="text-sm text-gray-500">
                                {{ room.users.length }} {{ room.users.length === 1 ? 'usuário' : 'usuários' }}
                            </span>
                            <span v-if="room.is_private && activeTab === 'public'"
                                  class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Privada</span>
                            <span v-else-if="activeTab === 'public'"
                                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Pública</span>
                            <span
                                :class="connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                class="px-2 py-1 text-xs rounded-full">
                                {{ connectionStatus === 'connected' ? '🟢 Online' : '🔴 Offline' }}
                            </span>
                        </div>
                    </div>

                    <div class="flex">
                        <!-- Sidebar -->
                        <div class="w-1/4 bg-gray-50 border-r border-gray-200">
                            <div class="p-4 border-b"><h2 class="text-black text-lg font-semibold">Conversas</h2></div>
                            <div class="p-4 border-b flex space-x-2">
                                <button @click="switchToPublic" :class="btnActivePublic">Chat Público</button>
                                <button @click="activeTab = 'private'" :class="btnActivePriv">Chats Privados</button>
                            </div>
                            <div v-if="activeTab === 'private'" class="overflow-y-auto max-h-96">
                                <div v-for="conv in privateConversations" :key="conv.id"
                                     @click="selectPrivateConversation(conv)"
                                     :class="['p-4 border-b cursor-pointer hover:bg-gray-100', currentPrivateConversation?.id === conv.id ? 'bg-blue-50' : '']">
                                    <div class="flex items-center">
                                        <div
                                            class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                                            {{ conv.other_user.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <h3 class="font-medium text-sm">{{ conv.other_user.name }}</h3>
                                            <p v-if="conv.latest_message" class="text-xs text-gray-500 truncate">
                                                {{ conv.latest_message.content }}
                                            </p>
                                            <p v-else class="text-xs text-gray-400 italic">Nenhuma mensagem ainda</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="privateConversations.length === 0"
                                     class="p-4 text-center text-gray-500 text-sm">
                                    Nenhuma conversa privada ainda.<br>Digite @ no chat público para iniciar.
                                </div>
                            </div>
                            <div v-if="activeTab === 'public'" class="p-4 text-center text-gray-500 text-sm">
                                Chat público ativo<br>Digite @ para mencionar usuários
                            </div>
                        </div>

                        <!-- Área do chat -->
                        <div class="flex-1 flex flex-col h-96">
                            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
                                <!-- Mensagens públicas -->
                                <template v-if="activeTab === 'public'">
                                    <div
                                        v-for="m in localMessages"
                                        :key="m.id"
                                        class="flex flex-col"
                                    >
                                        <div
                                            :class="m.user.id === user.id ? msgSent : msgRecv"
                                            class="max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow px-4 py-2"
                                        >
                                            <div class="flex items-center space-x-2 mb-1">
                                                <span class="text-xs font-semibold">{{ m.user.name }}</span>
                                                <span class="text-[10px] font-bold">
              {{ formatDate(m.created_at) }} - {{ formatTime(m.created_at) }}
            </span>
                                                <span v-if="m.edited_at" class="text-[10px] text-gray-400">(editada)</span>
                                            </div>
                                            <p class="text-sm break-words">{{ m.content }}</p>
                                        </div>
                                    </div>
                                </template>

                                <!-- Mensagens privadas -->
                                <template v-if="activeTab === 'private' && currentPrivateConversation">
                                    <div
                                        v-for="m in currentPrivateMessages"
                                        :key="m.id"
                                        class="flex flex-col"
                                    >
                                        <div
                                            :class="m.sender.id === user.id ? msgSent : msgRecv"
                                            class="max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow px-4 py-2"
                                        >
                                            <div class="flex items-center space-x-2 mb-1">
                                                <span class="text-xs font-semibold">{{ m.sender.name }}</span>
                                                <span class="text-[10px] font-bold">
              {{ formatDate(m.created_at) }} - {{ formatTime(m.created_at) }}
            </span>
                                                <span v-if="m.is_edited" class="text-[10px] text-gray-400">(editada)</span>
                                            </div>
                                            <p class="text-sm break-words">{{ m.content }}</p>
                                        </div>
                                    </div>
                                </template>

                                <!-- Placeholder sem conversa privada selecionada -->
                                <div
                                    v-if="activeTab === 'private' && !currentPrivateConversation"
                                    class="flex items-center justify-center h-full text-gray-500"
                                >
                                    <div class="text-center">
                                        <p class="text-lg mb-2">💬</p>
                                        <p>Selecione uma conversa</p>
                                        <p class="text-sm">Ou digite @ no público</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Formulário de envio -->
                            <div class="border-t p-4 bg-white">
                                <form @submit.prevent="sendMessage" class="flex space-x-2">
                                    <div class="flex-1 relative">
                                        <input
                                            ref="messageInput"
                                            v-model="newMessage"
                                            @input="handleInput"
                                            @keydown="handleKeydown"
                                            :placeholder="getPlaceholderText"
                                            class="w-full text-black px-3 py-4 border rounded-md focus:ring-2 focus:ring-blue-500"
                                            :disabled="isSending || (activeTab === 'private' && !currentPrivateConversation)"
                                        />
                                        <div
                                            v-if="showMentionDropdown && mentionUsers.length"
                                            class="absolute bottom-full left-0 right-0 bg-white border shadow-lg max-h-48 overflow-y-auto z-10 mb-1"
                                        >
                                            <div
                                                v-for="(u, i) in mentionUsers"
                                                :key="u.id"
                                                @click="selectMention(u)"
                                                :class="['p-3 hover:bg-gray-50 cursor-pointer', selectedMentionIndex === i ? 'bg-blue-50' : '']"
                                            >
                                                <div class="flex items-center">
                                                    <div
                                                        class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3"
                                                    >
                                                        {{ u.name.charAt(0).toUpperCase() }}
                                                    </div>
                                                    <div>
                                                        <p class="font-medium text-sm">{{ u.name }}</p>
                                                        <p class="text-xs text-gray-500">{{ u.email }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        :disabled="!newMessage.trim() || isSending || (activeTab === 'private' && !currentPrivateConversation)"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {{ isSending ? 'Enviando...' : 'Enviar' }}
                                    </button>
                                </form>
                            </div>
                        </div>


                        <!-- Gerenciamento de usuários da sala -->
                        <div v-if="showUserManager && canManageUsers && activeTab === 'public'"
                             class="w-80 border-l border-gray-200">
                            <RoomUserManager :room="room" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ChatLayout>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import axios from 'axios';
import { route } from 'ziggy-js';
import ChatLayout from '@/layouts/ChatLayout.vue';
import RoomUserManager from '@/components/RoomUserManager.vue';

// ============ TOKEN AUTENTICAÇÃO ============
let bearerToken = '';
// Ao montar, extrai o token da URL
onMounted(() => {
    const url = new URL(window.location.href);
    const tokenQuery = url.searchParams.get('token');
    if (tokenQuery) {
        bearerToken = tokenQuery;
        localStorage.setItem('chat_token', bearerToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
    } else {
        bearerToken = localStorage.getItem('chat_token') || '';
        if (bearerToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
    }
    setupEchoBearer();
});

// ============ CONFIGURA ECHO PARA USAR TOKEN ============
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
let echoInstance = null;

function setupEchoBearer() {
    if (!bearerToken) return;

    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authorizer: (channel, options) => {
            return {
                authorize: (socketId, callback) => {
                    fetch('/broadcasting/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${bearerToken}`,
                        },
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channel.name,
                        }),
                    })
                        .then(res => res.json())
                        .then(data => callback(false, data))
                        .catch(err => callback(true, err));
                },
            };
        },
    });

    // (opcional) Re-setup listeners se necessário
    cleanupEcho();
    setupEchoListeners();
}

const { props: pageProps } = usePage();
const props = defineProps({ room: Object, messages: Array });
const user = pageProps.auth?.user || {};

const messageInput = ref(null);
const messagesContainer = ref(null);

const newMessage = ref(''), isSending = ref(false);
const localMessages = ref([]), editingMessage = ref(null), editMessageContent = ref('');
const showUserManager = ref(false), connectionStatus = ref('disconnected');

const activeTab = ref('public');
const privateConversations = ref([]), currentPrivateConversation = ref(null), currentPrivateMessages = ref([]);

const showMentionDropdown = ref(false), mentionUsers = ref([]), selectedMentionIndex = ref(0),
    mentionStartIndex = ref(-1), roomUsers = ref([]);

const canManageUsers = computed(() => props.room.created_by === user.id);
const getPlaceholderText = computed(() => activeTab.value === 'public' ? 'Digite @ para mencionar usuários...' : (currentPrivateConversation.value ? 'Digite sua mensagem...' : 'Selecione uma conversa'));
const btnActivePublic = computed(() => activeTab.value === 'public' ? 'px-3 py-2 rounded text-sm font-medium bg-blue-500 text-white' : 'px-3 py-2 rounded text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300');
const btnActivePriv = computed(() => activeTab.value === 'private' ? 'px-3 py-2 rounded text-sm font-medium bg-blue-500 text-white' : 'px-3 py-2 rounded text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300');
const msgSent = 'self-end bg-blue-500 text-white', msgRecv = 'self-start bg-gray-100 text-gray-900';

async function loadPrivateConversations() {
    try {
        const { data } = await axios.get('/chat/private-conversations');
        privateConversations.value = data;
    } catch (e) {
        console.error('Erro ao carregar conversas privadas:', e);
    }
}

async function loadRoomUsers() {
    try {
        const url = `/chat/rooms/${props.room.slug}/available-users`;
        const { data } = await axios.get(url);
        roomUsers.value = data.filter(u => u.id !== user.id);
    } catch (e) {
        roomUsers.value = props.room.users.filter(u => u.id !== user.id);
    }
}

async function selectPrivateConversation(conversation) {
    currentPrivateConversation.value = conversation;
    try {
        const { data } = await axios.get(`/chat/private-conversations/${conversation.id}`);
        currentPrivateMessages.value = data.messages;
        await nextTick();
        scrollToBottom();
    } catch (e) {
        console.error(e);
    }
}

function switchToPublic() {
    activeTab.value = 'public';
    currentPrivateConversation.value = null;
    currentPrivateMessages.value = [];
    nextTick(scrollToBottom);
}

function handleInput() {
    if (activeTab.value !== 'public') return;
    const input = messageInput.value;
    if (!input) return;
    const val = input.value, pos = input.selectionStart;
    let start = -1;
    for (let i = pos - 1; i >= 0; i--) {
        if (val[i] === '@') {
            start = i;
            break;
        }
        if (val[i] === ' ') break;
    }
    if (start !== -1) {
        mentionStartIndex.value = start;
        const term = val.substring(start + 1, pos).toLowerCase();
        mentionUsers.value = roomUsers.value.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        showMentionDropdown.value = mentionUsers.value.length > 0;
        selectedMentionIndex.value = 0;
    } else {
        showMentionDropdown.value = false;
        mentionUsers.value = [];
    }
}

function handleKeydown(e) {
    if (!showMentionDropdown.value) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedMentionIndex.value = Math.min(selectedMentionIndex.value + 1, mentionUsers.value.length - 1);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedMentionIndex.value = Math.max(selectedMentionIndex.value - 1, 0);
    } else if (e.key === 'Enter' && showMentionDropdown.value) {
        e.preventDefault();
        selectMention(mentionUsers.value[selectedMentionIndex.value]);
    } else if (e.key === 'Escape') showMentionDropdown.value = false;
}

async function selectMention(u) {
    const input = messageInput.value;
    const beforeMention = newMessage.value.substring(0, mentionStartIndex.value);
    const afterCursor = newMessage.value.substring(input.selectionStart);
    newMessage.value = beforeMention + '@' + u.name + ' ' + afterCursor;
    nextTick(() => {
        const newPosition = beforeMention.length + u.name.length + 2;
        input.setSelectionRange(newPosition, newPosition);
    });

    try {
        const { data } = await axios.post('/chat/private-conversations', { user_id: u.id });
        await loadPrivateConversations();
        activeTab.value = 'private';
        currentPrivateConversation.value = data;
        currentPrivateMessages.value = data.messages || [];
        scrollToBottom();
    } catch (e) {}
    showMentionDropdown.value = false;
    mentionUsers.value = [];
}

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    });
}

async function sendMessage() {
    if (!newMessage.value.trim()) return;
    isSending.value = true;
    try {
        if (activeTab.value === 'public') {
            await router.post(route('messages.store', props.room.slug), { content: newMessage.value }, {
                preserveState: true,
                onSuccess: () => {
                    newMessage.value = '';
                    scrollToBottom();
                }
            });
        } else if (currentPrivateConversation.value) {
            await axios.post(
                `/chat/private-conversations/${currentPrivateConversation.value.id}/messages`,
                { content: newMessage.value }
            );
            await loadPrivateConversations();
            newMessage.value = '';
            await nextTick();
            scrollToBottom();
        }
    } catch (e) {
        console.error(e);
    } finally {
        isSending.value = false;
    }
}

function cancelEdit() {
    editingMessage.value = null;
    editMessageContent.value = '';
}

async function updateMessage() {
    if (!editMessageContent.value.trim()) return;
    isSending.value = true;
    try {
        await router.put(route('messages.update', editingMessage.value.slug), { content: editMessageContent.value }, {
            preserveState: true,
            onSuccess: cancelEdit
        });
    } catch (e) {
        console.error(e);
    } finally {
        isSending.value = false;
    }
}

async function deleteMessage(id) {
    if (!confirm('Confirma?')) return;
    try {
        await router.delete(route('messages.destroy', id), {
            preserveState: true, onSuccess: () => {
                const i = localMessages.value.findIndex(m => m.id === id);
                if (i > -1) localMessages.value.splice(i, 1);
            }
        });
    } catch (e) {
        console.error(e);
    }
}

async function leaveRoom() {
    if (!confirm('Confirma saída?')) return;
    try {
        await router.delete(route('rooms.leave', props.room.slug));
    } catch (e) {
        console.error(e);
    }
}

function formatTime(t) {
    return new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(t) {
    return new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

let echoChannel = null, privateEchoChannel = null;

function cleanupEcho() {
    if (echoChannel) {
        window.Echo.leave(`room.${props.room.slug}`);
        echoChannel = null;
    }
    if (privateEchoChannel) {
        window.Echo.leave(`user.${user.id}`);
        privateEchoChannel = null;
    }
}

function setupEchoListeners() {
    if (!window.Echo) return;
    echoChannel = window.Echo.private(`room.${props.room.slug}`)
        .listen('.message.sent', e => {
            if (!localMessages.value.some(m => m.id === e.id)) {
                localMessages.value.push(e);
                if (activeTab.value === 'public') scrollToBottom();
            }
        });
    privateEchoChannel = window.Echo.private(`user.${user.id}`)
        .listen('.private-message-sent', e => {
            if (activeTab.value === 'private' &&
                currentPrivateConversation.value?.id === e.message.conversation_id) {
                currentPrivateMessages.value.push(e.message);
                scrollToBottom();
            }
            loadPrivateConversations();
        });
}

watch(() => props.room.slug, async () => {
    activeTab.value = 'public';
    currentPrivateConversation.value = null;
    currentPrivateMessages.value = [];
    await loadPrivateConversations();
    await loadRoomUsers();
    cleanupEcho();
    setupEchoBearer();
});

onMounted(async () => {
    localMessages.value = props.messages.map(m => ({ ...m }));
    scrollToBottom();
    await loadPrivateConversations();
    await loadRoomUsers();
    cleanupEcho();
    setupEchoBearer();
});
onUnmounted(cleanupEcho);

</script>
