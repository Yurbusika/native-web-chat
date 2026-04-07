const segments = (path) => path.split('/').filter(Boolean);

export const getRoutePathParams = (routePattern, pathname) => {
  const patternParts = segments(routePattern);
  const urlParts = segments(pathname);
  if (patternParts.length !== urlParts.length) {
    return {};
  }
  
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(urlParts[i]);
    }
  }
  return params;
};
