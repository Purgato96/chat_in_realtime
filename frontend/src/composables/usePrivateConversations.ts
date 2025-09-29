import { ref } from 'vue';
import { PrivateConversationService, PrivateMessageService } from '@/services';

const conversations = ref([]);
const currentConversation = ref(null);
const messages = ref([]);
const loading = ref(false);

export function usePrivateConversations() {
  const fetchConversations = async () => {
    loading.value = true;
    try {
      conversations.value = await PrivateConversationService.getAll();
    } finally {
      loading.value = false;
    }
  };

  const startConversation = async (userId) => {
    const conversation = await PrivateConversationService.start(userId);

    // Adiciona à lista se não existir
    if (!conversations.value.some(c => c.id === conversation.id)) {
      conversations.value.unshift(conversation);
    }

    return conversation;
  };

  const openConversation = async (conversationId) => {
    loading.value = true;
    try {
      const conversation = await PrivateConversationService.getById(conversationId);
      currentConversation.value = conversation;
      messages.value = conversation.messages || [];
      return conversation;
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = async (conversationId, content) => {
    const message = await PrivateMessageService.send(conversationId, content);
    messages.value.push(message);

    // Atualiza a lista de conversas
    await fetchConversations();

    return message;
  };

  const updateMessage = async (conversationId, messageId, content) => {
    const updatedMessage = await PrivateMessageService.update(conversationId, messageId, content);

    const index = messages.value.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }

    return updatedMessage;
  };

  const markAsRead = async (conversationId, messageId) => {
    await PrivateMessageService.markAsRead(conversationId, messageId);

    // Atualiza mensagem como lida
    const message = messages.value.find(msg => msg.id === messageId);
    if (message) {
      message.read_at = new Date().toISOString();
    }
  };

  const addMessage = (message) => {
    // Para quando receber via WebSocket
    if (currentConversation.value?.id === message.conversation_id) {
      if (!messages.value.some(msg => msg.id === message.id)) {
        messages.value.push(message);
      }
    }

    // Refresh das conversas para atualizar última mensagem
    fetchConversations();
  };

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    fetchConversations,
    startConversation,
    openConversation,
    sendMessage,
    updateMessage,
    markAsRead,
    addMessage
  };
}
