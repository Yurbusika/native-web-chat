import { getReadedPublicFile } from './shared/utils/get-readed-public-file.js';
import { authController } from './auth/auth.controller.js';
import { chatController } from './chats/chat.controller.js';

export const pagesRoutes = [
  {
    path: '/login',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('login.html');
      res.end(data);
    },
  },
  {
    path: '/registration',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('registration.html');
      res.end(data);
    },
  },
  {
    path: '/',
    method: 'GET',
    handler: async (_req, res) => {
      const data = await getReadedPublicFile('landing.html');
      res.end(data);
    },
  },
];

export const apiRoutes = [...authController, ...chatController];