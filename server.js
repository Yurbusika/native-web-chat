import http from 'http';

import { requireAuth } from './auth/require-auth.js';
import { pagesRoutes, apiRoutes } from './routes.js';
import { initDb } from './shared/utils/db-helpers.js';
import { matchRoute } from './shared/utils/match-route.js';
import { getPathname } from './shared/utils/get-pathname.js';
import { getRouteQueryParams } from './shared/utils/get-route-query-params.js';
import { getRoutePathParams } from './shared/utils/get-route-path-params.js';
import { getListenHost } from './shared/utils/get-listen-host.js';
import { getListenPort } from './shared/utils/get-listen-port.js';
import { tryServePublicStatic } from './shared/utils/serve-public-static.js';
import { attachWebSocket } from './websoket/attach-websocket.js';

await initDb();

const port = getListenPort();
const host = getListenHost();

const server = http.createServer(async (req, res) => {
  const pathname = getPathname(req);

  const pageRoute = pagesRoutes.find((r) => r.path === pathname && r.method === req.method);
  const apiRoute = pageRoute
    ? null
    : matchRoute(pathname, req.method, apiRoutes);
  const existedRoute = pageRoute ?? apiRoute;

  const routeQueryParams = getRouteQueryParams(req.url);
  const routePathParams = existedRoute ? getRoutePathParams(existedRoute.path, pathname) : {};

  if (existedRoute) {
    if (existedRoute.requiresAuth) {
      const auth = await requireAuth(req, res);
      if (!auth) {
        return;
      }
      await existedRoute.handler(req, res, auth, {
        queryParams: routeQueryParams,
        pathParams: routePathParams,
      });
      return;
    }

    await existedRoute.handler(req, res);
    return;
  }

  if (
    (req.method === 'GET' || req.method === 'HEAD') &&
    (await tryServePublicStatic(req, res, pathname))
  ) {
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

attachWebSocket(server);