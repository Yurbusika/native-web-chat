import { getSessionIdFromRequest } from '../shared/utils/cookie-helpers.js';
import { findValidSession } from './auth.repository.js';

export const requireAuth = async (req, res) => {
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Не авторизован' }));
    return null;
  }
  const row = await findValidSession(sessionId);
  if (!row) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Не авторизован' }));
    return null;
  }
  return {
    sessionId,
    userId: row.userId,
    username: row.username,
  };
};
