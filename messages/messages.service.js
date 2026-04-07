import { getChatWithPeerForUser } from '../chats/chat.repository.js';
import { getBodyFromReq } from '../shared/utils/get-body-from-req.js';
import { jsonResponse } from '../shared/utils/json-res.js';
import {
  createMessageRepository,
  deleteMessageRepository,
  getMessageByIdRepository,
  getMessagesByChatIdRepository,
} from './messages.repository.js';

const parsePositiveInt = (raw) => {
  const id = Number.parseInt(String(raw), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
};

export const getMessagesByChatId = async (_req, res, auth, params) => {
  const chatId = parsePositiveInt(params?.chatId);
  if (!chatId) {
    jsonResponse(res, 400, { error: 'Некорректный идентификатор чата' });
    return;
  }

  const row = await getChatWithPeerForUser(chatId, auth.userId);
  if (!row) {
    jsonResponse(res, 404, { error: 'Чат не найден' });
    return;
  }

  const messages = await getMessagesByChatIdRepository(chatId);
  jsonResponse(res, 200, messages);
};

export const createMessage = async (req, res, auth, params) => {
  const chatId = parsePositiveInt(params?.chatId);
  if (!chatId) {
    jsonResponse(res, 400, { error: 'Некорректный идентификатор чата' });
    return;
  }

  const row = await getChatWithPeerForUser(chatId, auth.userId);
  if (!row) {
    jsonResponse(res, 404, { error: 'Чат не найден' });
    return;
  }

  const body = await getBodyFromReq(req);
  const message = await createMessageRepository(chatId, auth.userId, body.body);
  jsonResponse(res, 201, message);
};

export const deleteMessage = async (_req, res, auth, params) => {
  const chatId = parsePositiveInt(params?.chatId);
  const messageId = parsePositiveInt(params?.messageId);
  if (!chatId || !messageId) {
    jsonResponse(res, 400, { error: 'Некорректные идентификаторы' });
    return;
  }

  const chatRow = await getChatWithPeerForUser(chatId, auth.userId);
  if (!chatRow) {
    jsonResponse(res, 404, { error: 'Чат не найден' });
    return;
  }

  const message = await getMessageByIdRepository(messageId);
  if (!message || message.chat_id !== chatId) {
    jsonResponse(res, 404, { error: 'Сообщение не найдено' });
    return;
  }

  await deleteMessageRepository(messageId);
  jsonResponse(res, 200, { ok: true });
};