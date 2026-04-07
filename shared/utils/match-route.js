const pathSegments = (pathname) => pathname.split('/').filter(Boolean);

const pathPatternMatches = (urlParts, patternParts) => {
  if (urlParts.length !== patternParts.length) {
    return false;
  }
  for (let i = 0; i < urlParts.length; i++) {
    const patternSeg = patternParts[i];
    if (patternSeg.startsWith(':')) {
      continue;
    }
    if (urlParts[i] !== patternSeg) {
      return false;
    }
  }
  return true;
};

export const matchRoute = (pathname, method, routes) => {
  const urlParts = pathSegments(pathname);
  for (const r of routes) {
    if (r.method !== method) {
      continue;
    }
    const patternParts = pathSegments(r.path);
    if (!pathPatternMatches(urlParts, patternParts)) {
      continue;
    }
    return r;
  }

  return null;
};
