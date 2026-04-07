import { getUserById } from '../user/user.repository.js';
import { getBodyFromReq } from '../shared/utils/get-body-from-req.js';
import {
  deleteChat as removeChatById,
  findOneToOneChatIdBetweenUsers,
  getChatWithPeerForUser,
  insertChatWithTwoMembers,
  listChatsWithPeerForUser,
  markChatReadForUser,
} from './chat.repository.js';

const json = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const parseChatId = (raw) => {
  const id = Number.parseInt(String(raw), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export const getChats = async (_req, res, auth) => {
  const rows = await listChatsWithPeerForUser(auth.userId);
  json(res, 200, rows);
};

export const getChatById = async (_req, res, auth, params) => {
  const chatId = parseChatId(params.pathParams?.id);
  if (!chatId) {
    json(res, 400, { error: 'Некорректный идентификатор чата' });
    return;
  }
  const row = await getChatWithPeerForUser(chatId, auth.userId);
  if (!row) {
    json(res, 404, { error: 'Чат не найден' });
    return;
  }
  json(res, 200, row);
};

export const createChat = async (req, res, auth) => {
  let body;
  try {
    body = await getBodyFromReq(req);
  } catch {
    json(res, 400, { error: 'Некорректное тело запроса' });
    return;
  }
  const peerId = Number.parseInt(String(body?.peerId), 10);
  if (!Number.isFinite(peerId) || peerId <= 0) {
    json(res, 400, { error: 'Укажите peerId собеседника' });
    return;
  }
  if (peerId === auth.userId) {
    json(res, 400, { error: 'Нельзя создать чат с самим собой' });
    return;
  }
  const peer = await getUserById(peerId);
  if (!peer) {
    json(res, 404, { error: 'Пользователь не найден' });
    return;
  }
  const existingId = await findOneToOneChatIdBetweenUsers(auth.userId, peerId);
  if (existingId !== null) {
    json(res, 200, { id: existingId, existed: true });
    return;
  }
  const now = Date.now();
  const id = await insertChatWithTwoMembers(auth.userId, peerId, now);
  json(res, 201, { id, existed: false });
};

export const updateChat = async (_req, res, auth, params) => {
  const chatId = parseChatId(params.pathParams?.id);
  if (!chatId) {
    json(res, 400, { error: 'Некорректный идентификатор чата' });
    return;
  }
  const before = await getChatWithPeerForUser(chatId, auth.userId);
  if (!before) {
    json(res, 404, { error: 'Чат не найден' });
    return;
  }
  await markChatReadForUser(chatId, auth.userId);
  const row = await getChatWithPeerForUser(chatId, auth.userId);
  json(res, 200, row);
};

export const deleteChat = async (_req, res, auth, params) => {
  const chatId = parseChatId(params.pathParams?.id);
  if (!chatId) {
    json(res, 400, { error: 'Некорректный идентификатор чата' });
    return;
  }
  const row = await getChatWithPeerForUser(chatId, auth.userId);
  if (!row) {
    json(res, 404, { error: 'Чат не найден' });
    return;
  }
  await removeChatById(chatId);
  json(res, 200, { ok: true });
};
