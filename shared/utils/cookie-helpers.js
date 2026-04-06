import { SESSION_COOKIE_NAME } from '../constants/session-consts.js';

export const parseCookieHeader = (header) => {
  if (header == null || header === '') {
    return {};
  }
  const result = {};
  for (const segment of String(header).split(';')) {
    const trimmed = segment.trim();
    if (!trimmed) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      result[trimmed] = '';
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    result[key] = value;
  }
  return result;
};

export const buildSessionSetCookie = (token, maxAgeSec) => {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    `Max-Age=${maxAgeSec}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
};

export const buildSessionClearCookie = () => {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Max-Age=0',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
};

export const getSessionIdFromRequest = (req) => {
  const raw = req.headers.cookie;
  if (typeof raw !== 'string') {
    return undefined;
  }
  const cookies = parseCookieHeader(raw);
  const id = cookies[SESSION_COOKIE_NAME];
  return typeof id === 'string' && id.length > 0 ? id : undefined;
};
