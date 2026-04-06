import http from 'http';

import { requireAuth } from './auth/require-auth.js';
import { pagesRoutes, apiRoutes } from './routes.js';
import { initDb } from './shared/utils/db-helpers.js';
import { matchParameterizedRoute } from './shared/utils/match-parameterized-route.js';
import { getPathname } from './shared/utils/get-pathname.js';

await initDb();

const server = http.createServer(async (req, res) => {
  const pathname = getPathname(req);
  const pageRoute = pagesRoutes.find(
    (r) => r.path === pathname && r.method === req.method
  );
  const apiMatch = pageRoute
    ? null
    : matchParameterizedRoute(pathname, req.method, apiRoutes);
  const existedRoute = pageRoute ?? apiMatch?.route;
  const routeParams = apiMatch?.params ?? {};

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
