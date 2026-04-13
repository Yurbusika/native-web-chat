const DEFAULT_PORT = 3000;

export function getListenPort(env = process.env) {
  const parsedPort = Number.parseInt(String(env.PORT ?? ''), 10);
  if (Number.isInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65535) {
    return parsedPort;
  }
  return DEFAULT_PORT;
}
