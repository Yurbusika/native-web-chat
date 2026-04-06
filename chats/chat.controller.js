import {
  createChat,
  deleteChat,
  getChatById,
  getChats,
  updateChat,
} from './chat.service.js';

export const chatController = [
  {
    path: '/api/chats',
    method: 'GET',
    requiresAuth: true,
    handler: getChats,
  },
  {
    path: '/api/chats/:id',
    method: 'GET',
    requiresAuth: true,
    handler: getChatById,
  },
  {
    path: '/api/chats',
    method: 'POST',
    requiresAuth: true,
    handler: createChat,
  },
  {
    path: '/api/chats/:id',
    method: 'PUT',
    requiresAuth: true,
    handler: updateChat,
  },
  {
    path: '/api/chats/:id',
    method: 'DELETE',
    requiresAuth: true,
    handler: deleteChat,
  },
];
