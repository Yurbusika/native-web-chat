import http from 'http';

import { requireAuth } from './auth/require-auth.js';
import { pagesRoutes, apiRoutes } from './routes.js';
import { initDb } from './shared/utils/db-helpers.js';
import { matchRoute } from './shared/utils/match-route.js';
import { getPathname } from './shared/utils/get-pathname.js';
import { getRouteParams } from './shared/utils/get-route-params.js';

await initDb();

const server = http.createServer(async (req, res) => {
  const pathname = getPathname(req);

  const pageRoute = pagesRoutes.find((r) => r.path === pathname && r.method === req.method);
  const apiRoute = pageRoute
    ? null
    : matchRoute(pathname, req.method, apiRoutes);
  const existedRoute = pageRoute ?? apiRoute;

  const routeParams = getRouteParams(req.url);

  if (existedRoute) {
    if (existedRoute.requiresAuth) {
      const auth = await requireAuth(req, res);
      if (!auth) {
        return;
      }
      await existedRoute.handler(req, res, auth, routeParams);
      return;
    }

    await existedRoute.handler(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
});

server.listen(process.env.PORT, Number(process.env.HOST), () => {
  console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});
