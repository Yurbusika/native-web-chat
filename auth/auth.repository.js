import crypto from 'node:crypto';

import { getAsync, runAsync } from '../shared/utils/db-helpers.js';

export const createSession = async (userId, expiresAtMs) => {
  const id = crypto.randomBytes(32).toString('base64url');
  await runAsync(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [id, userId, expiresAtMs]
  );
  return id;
};

export const findValidSession = async (sessionId) => {
  if (!sessionId || typeof sessionId !== 'string') {
    return undefined;
  }
  const now = Date.now();
  return await getAsync(
    `SELECT s.user_id AS userId, u.username
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > ?`,
    [sessionId, now]
  );
};

export const deleteSession = async (sessionId) => {
  await runAsync('DELETE FROM sessions WHERE id = ?', [sessionId]);
};