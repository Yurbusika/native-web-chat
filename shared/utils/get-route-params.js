export const getRouteParams = (url) => {
  const qIndex = url.indexOf('?');
  if (qIndex === -1) {
    return {};
  }
  const query = url.slice(qIndex + 1).split('#')[0];
  if (!query) {
    return {};
  }
  
  return Object.fromEntries(new URLSearchParams(query));
};
