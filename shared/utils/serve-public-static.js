import fs from 'fs';
import path from 'path';

const PUBLIC_ROOT = path.join(path.resolve(), 'public');

const MIME_BY_EXT = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] ?? 'application/octet-stream';
};

const isInsidePublicRoot = (resolvedPath) => {
  if (resolvedPath === PUBLIC_ROOT) {
    return true;
  }
  const relative = path.relative(PUBLIC_ROOT, resolvedPath);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
};


const resolvePublicFileToServe = async (pathname) => {
  const trimmed = pathname.replace(/^\/+/, '');
  if (trimmed.includes('\0')) {
    return null;
  }
  let rest;
  try {
    rest = decodeURIComponent(trimmed);
  } catch {
    return null;
  }
  if (rest.includes('\0')) {
    return null;
  }

  const normalized = path.normalize(rest.length === 0 ? '.' : rest);
  const candidate = path.resolve(PUBLIC_ROOT, normalized);
  if (!isInsidePublicRoot(candidate)) {
    return null;
  }

  let st;
  try {
    st = await fs.promises.stat(candidate);
  } catch {
    return null;
  }

  let filePath = candidate;
  if (st.isDirectory()) {
    filePath = path.join(candidate, 'index.html');
    try {
      st = await fs.promises.stat(filePath);
    } catch {
      return null;
    }
    if (!st.isFile()) {
      return null;
    }
  } else if (!st.isFile()) {
    return null;
  }

  return { filePath, size: st.size };
};


export const tryServePublicStatic = async (req, res, pathname) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return false;
  }
  if (pathname.startsWith('/api/')) {
    return false;
  }

  const resolved = await resolvePublicFileToServe(pathname);
  if (!resolved) {
    return false;
  }

  const { filePath, size } = resolved;
  const headers = {
    'Content-Type': getContentType(filePath),
    'Content-Length': String(size),
  };

  if (req.method === 'HEAD') {
    res.writeHead(200, headers);
    res.end();
    return true;
  }

  res.writeHead(200, headers);
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    stream.destroy();
    if (!res.headersSent) {
      res.writeHead(500);
      res.end();
      return;
    }
    res.destroy();
  });
  stream.pipe(res);
  return true;
};
