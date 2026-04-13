import { getReadedPublicFile } from './shared/utils/get-readed-public-file.js';
import { authController } from './auth/auth.controller.js';
import { chatController } from './chats/chat.controller.js';
import { messagesController } from './messages/messages.controller.js';
import { userController } from './user/user.controller.js';

export const pagesRoutes = [
  {
    path: '/login',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('/pages/login/index.html');
      res.end(data);
    },
  },
  {
    path: '/registration',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('pages/registration/index.html');
      res.end(data);
    },
  },
  {
    path: '/',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('index.html');
      res.end(data);
    },
  },
  {
    path: '/chat',
    method: 'GET',
    handler: async (req, res) => {
      const data = await getReadedPublicFile('pages/chat/index.html');
      res.end(data);
    },
    requiresAuth: true,
  },
];

export const apiRoutes = [...authController, ...chatController, ...messagesController, ...userController];