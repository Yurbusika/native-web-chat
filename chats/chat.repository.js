import { allAsync, getAsync, runAsync } from '../shared/utils/db-helpers.js';

export const findOneToOneChatIdBetweenUsers = async (userIdA, userIdB) => {
  const row = await getAsync(
    `SELECT m1.chat_id AS id
     FROM chat_members m1
     INNER JOIN chat_members m2 ON m2.chat_id = m1.chat_id AND m2.user_id = ?
     WHERE m1.user_id = ?
       AND (SELECT COUNT(*) FROM chat_members WHERE chat_id = m1.chat_id) = 2`,
    [userIdB, userIdA]
  );
  return row?.id ?? null;
};

export const insertChatWithTwoMembers = async (userIdA, userIdB, now) => {
  await runAsync('BEGIN');
  try {
    const { lastID: chatId } = await runAsync(
      'INSERT INTO chats (created_at, updated_at) VALUES (?, ?)',
      [now, now]
    );
    await runAsync(
      'INSERT INTO chat_members (chat_id, user_id, has_unread) VALUES (?, ?, 0)',
      [chatId, userIdA]
    );
    await runAsync(
      'INSERT INTO chat_members (chat_id, user_id, has_unread) VALUES (?, ?, 0)',
      [chatId, userIdB]
    );
    await runAsync('COMMIT');
    return chatId;
  } catch (e) {
    await runAsync('ROLLBACK');
    throw e;
  }
};

export const listChatsWithPeerForUser = async (userId) => {
  return await allAsync(
    `SELECT c.id, c.created_at, c.updated_at, me.has_unread,
            peer.user_id AS peer_id, u.username AS peer_username
     FROM chats c
     INNER JOIN chat_members me ON me.chat_id = c.id AND me.user_id = ?
     INNER JOIN chat_members peer ON peer.chat_id = c.id AND peer.user_id != ?
     INNER JOIN users u ON u.id = peer.user_id
     ORDER BY c.updated_at DESC`,
    [userId, userId]
  );
};

export const getChatWithPeerForUser = async (chatId, userId) => {
  return await getAsync(
    `SELECT c.id, c.created_at, c.updated_at, me.has_unread,
            peer.user_id AS peer_id, u.username AS peer_username
     FROM chats c
     INNER JOIN chat_members me ON me.chat_id = c.id AND me.user_id = ?
     INNER JOIN chat_members peer ON peer.chat_id = c.id AND peer.user_id != ?
     INNER JOIN users u ON u.id = peer.user_id
     WHERE c.id = ?`,
    [userId, userId, chatId]
  );
};

export const markChatReadForUser = async (chatId, userId) => {
  const { changes } = await runAsync(
    'UPDATE chat_members SET has_unread = 0 WHERE chat_id = ? AND user_id = ?',
    [chatId, userId]
  );
  return changes;
};

export const deleteChat = async (chatId) => {
  await runAsync('DELETE FROM chats WHERE id = ?', [chatId]);
};
