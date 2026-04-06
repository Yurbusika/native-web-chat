export const getPathname = (req) => {
  const raw = req.url ?? '/';
  const q = raw.indexOf('?');
  return q === -1 ? raw : raw.slice(0, q);
};