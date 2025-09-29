import { ref } from 'vue';
import { MessageService } from '@/services';

const messages = ref([]);
const loading = ref(false);

export function useMessages() {
  const fetchMessages = async (roomSlug, params = {}) => {
    loading.value = true;
    try {
      const response = await MessageService.getRoomMessages(roomSlug, params);
      messages.value = response.data || response;
      return messages.value;
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = async (roomSlug, content) => {
    const response = await MessageService.sendRoomMessage(roomSlug, content);
    const message = response.data || response;
    messages.value.push(message);
    return message;
  };

  const updateMessage = async (messageId, content) => {
    const response = await MessageService.update(messageId, content);
    const updatedMessage = response.data || response;

    const index = messages.value.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }

    return updatedMessage;
  };

  const deleteMessage = async (messageId) => {
    await MessageService.delete(messageId);
    messages.value = messages.value.filter(msg => msg.id !== messageId);
  };

  const searchMessages = async (roomSlug, query, params = {}) => {
    loading.value = true;
    try {
      const response = await MessageService.search(roomSlug, query, params);
      return response.data || response;
    } finally {
      loading.value = false;
    }
  };

  const addMessage = (message) => {
    // Para quando receber via WebSocket
    if (!messages.value.some(msg => msg.id === message.id)) {
      messages.value.push(message);
    }
  };

  const removeMessage = (messageId) => {
    // Para quando deletar via WebSocket
    messages.value = messages.value.filter(msg => msg.id !== messageId);
  };

  const updateMessageInList = (updatedMessage) => {
    // Para quando atualizar via WebSocket
    const index = messages.value.findIndex(msg => msg.id === updatedMessage.id);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }
  };

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    searchMessages,
    addMessage,
    removeMessage,
    updateMessageInList
  };
}
