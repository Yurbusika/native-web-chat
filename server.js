import http from 'http';

import { requireAuth } from './auth/require-auth.js';
import { pagesRoutes, apiRoutes } from './routes.js';
import { initDb } from './shared/utils/db-helpers.js';


await initDb();

const server = http.createServer(async (req, res) => {
  const route = pagesRoutes.find((r) => r.path === req.url && r.method === req.method);
  const apiRoute = apiRoutes.find((r) => r.path === req.url && r.method === req.method);

  const existedRoute = route || apiRoute;
  

  if (existedRoute) {
    if (existedRoute.requiresAuth) {
      const auth = await requireAuth(req, res);
      if (!auth) {
        return;
      }
      await existedRoute.handler(req, res, auth);
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