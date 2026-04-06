const pathSegments = (pathname) => pathname.split('/').filter(Boolean);

export const matchParameterizedRoute = (pathname, method, routes) => {
  const urlParts = pathSegments(pathname);
  for (const r of routes) {
    if (r.method !== method) {
      continue;
    }
    const patternParts = pathSegments(r.path);
    if (patternParts.length !== urlParts.length) {
      continue;
    }
    const params = {};
    let ok = true;
    for (let i = 0; i < patternParts.length; i++) {
      const p = patternParts[i];
      if (p.startsWith(':')) {
        params[p.slice(1)] = decodeURIComponent(urlParts[i]);
      } else if (p !== urlParts[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      return { route: r, params };
    }
  }
  return null;
};