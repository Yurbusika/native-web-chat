
import { loginUser, logoutUser, registerUser } from './auth.service.js';

export const authController = [
  {
    path: '/api/registration',
    method: 'POST',
    handler: registerUser,
  },
  {
    path: '/api/login',
    method: 'POST',
    handler: loginUser,
  },
  {
    path: '/api/logout',
    method: 'POST',
    requiresAuth: true,
    handler: logoutUser,
  },
];