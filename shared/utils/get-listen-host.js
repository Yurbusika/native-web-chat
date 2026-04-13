const DEFAULT_HOST = 'localhost';

export function getListenHost(env = process.env) {
  const trimmed = typeof env.HOST === 'string' ? env.HOST.trim() : '';
  return trimmed !== '' ? trimmed : DEFAULT_HOST;
}
