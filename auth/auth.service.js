import { SESSION_MAX_AGE_SEC } from '../shared/constants/session-consts.js';
import { getBodyFromReq } from '../shared/utils/get-body-from-req.js';
import { buildSessionClearCookie, buildSessionSetCookie } from '../shared/utils/cookie-helpers.js';
import { hashPassword, verifyPassword } from '../shared/utils/pass-helpers.js';
import { createUser, getUserByName } from '../user/user.repository.js';
import { createSession, deleteSession } from './auth.repository.js';


export const registerUser = async (req, res) => {
  const body = await getBodyFromReq(req);
  const hashedPassword = await hashPassword(body.password);

  if (!body.username || !body.password) {
    return res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'Некорректные данные для регистрации' }));
  }

  const existingUser = await getUserByName(body.username);
  if (existingUser) {
    return res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'Пользователь с таким именем уже существует' }));
  }

  const user = await createUser(body.username, hashedPassword);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
}


export const loginUser = async (req, res) => {
  const body = await getBodyFromReq(req);
  const user = await getUserByName(body.username);
  if (!user) {
    return res
      .writeHead(401, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'Неверное имя пользователя или пароль' }));
  }
  const isPasswordValid = await verifyPassword(body.password, user.password);
  if (!isPasswordValid) {
    return res
      .writeHead(401, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: 'Неверное имя пользователя или пароль' }));
  }

  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const sessionId = await createSession(user.id, expiresAt);
  const setCookie = buildSessionSetCookie(sessionId, SESSION_MAX_AGE_SEC);

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': setCookie,
  });
  res.end(JSON.stringify({ id: user.id, username: user.username }));
};

export const logoutUser = async (_req, res, auth) => {
  await deleteSession(auth.sessionId);
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': buildSessionClearCookie(),
  });
  res.end(JSON.stringify({ message: 'Вы успешно вышли из системы' }));
};