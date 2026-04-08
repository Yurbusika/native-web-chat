import { clients } from "../../websoket/attach-websocket.js";

export const sendWsMessage = (userId, message) => {
  const client = clients.get(userId);
  if (client) {
    client.send(JSON.stringify(message));
  }
};

export const closeWsConnection = (userId) => {
  const client = clients.get(userId);
  if (client) {
    client.close();
  }

  clients.delete(userId);
};