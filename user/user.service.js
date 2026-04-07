import { jsonResponse } from '../shared/utils/json-res.js';
import { findUserByNameRepository } from './user.repository.js';

export const findUserByName = async (_req, res, _auth, params) => {
  const partialName = params?.name;

  if (!partialName) {
    jsonResponse(res, 400, { error: 'Некорректное имя пользователя' });
    return;
  }
  const users = await findUserByNameRepository(partialName);
  jsonResponse(res, 200, users);
};