import { allAsync, getAsync, runAsync } from '../shared/utils/db-helpers.js';

export const getMessagesByChatIdRepository = async (chatId) => {
  return await allAsync(
    `SELECT m.id, m.chat_id, m.sender_id, m.body, m.created_at,
            u.username AS senderName
     FROM messages m
     INNER JOIN users u ON u.id = m.sender_id
     WHERE m.chat_id = ?
     ORDER BY m.created_at ASC`,
    [chatId]
  );
};

export const createMessageRepository = async (chatId, senderId, body) => {
  const created_at = Date.now();
  return await runAsync(
    'INSERT INTO messages (chat_id, sender_id, body, created_at) VALUES (?, ?, ?, ?)',
    [chatId, senderId, body, created_at]
  );
};

export const getMessageByIdRepository = async (messageId) => {
  return await getAsync('SELECT * FROM messages WHERE id = ?', [messageId]);
};

export const deleteMessageRepository = async (messageId) => {
  return await runAsync('DELETE FROM messages WHERE id = ?', [messageId]);
};