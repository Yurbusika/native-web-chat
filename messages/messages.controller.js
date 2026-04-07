import { createMessage, deleteMessage, getMessagesByChatId } from "./messages.service.js";

export const messagesController = [
  {
    path: '/api/chats/:chatId/messages',
    method: 'GET',
    requiresAuth: true,
    handler: getMessagesByChatId,
  },
  {
    path: '/api/chats/:chatId/messages',
    method: 'POST',
    requiresAuth: true,
    handler: createMessage,
  },
  {
    path: '/api/chats/:chatId/messages/:messageId',
    method: 'DELETE',
    requiresAuth: true,
    handler: deleteMessage,
  },
]