import { jsonResponse } from '../shared/utils/json-res.js';
import { findUserByNameRepository } from './user.repository.js';

export const findUserByName = async (_req, res, auth, params) => {
  const partialName = params.queryParams?.name;

  if (!partialName) {
    jsonResponse(res, 400, { error: 'Некорректное имя пользователя' });
    return;
  }
  const rows = await findUserByNameRepository(partialName);
  const filtered = rows.filter((u) => u.id !== auth.userId);
  jsonResponse(res, 200, filtered);
};