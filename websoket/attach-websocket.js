import { WebSocketServer } from "ws";
import { getSessionIdFromRequest } from "../shared/utils/cookie-helpers.js";
import { findValidSession } from "../auth/auth.repository.js";

export const clients = new Map();

export const attachWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const sessionId = getSessionIdFromRequest(req);
    
    if (!sessionId) {
      ws.close();
      return;
    }

    const session = await findValidSession(sessionId);
    if (!session) {
      ws.close();
      return;
    }

    clients.set(session.userId, ws);

    const removeIfStillThisSocket = () => {
      if (clients.get(session.userId) === ws) {
        clients.delete(session.userId);
      }
    };

    ws.on('close', removeIfStillThisSocket);
    ws.on('error', removeIfStillThisSocket);
  });

  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};