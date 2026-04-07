import { findUserByName } from "./user.service.js";

export const userController = [
  {
    path: '/api/users',
    method: 'GET',
    requiresAuth: true,
    handler: findUserByName,
  },
];