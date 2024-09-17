const WebSocket = require("ws");
const Utils = require("./utils");

// Store connected clients
const clients = new Set();

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", (message) => {
      // Broadcast to all clients
      broadcast(message);
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });
};

const broadcast = (message) => {
  //Utils.log(message);
  const jsonMessage = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonMessage);
    }
  });
};

const shutdown = () => {
  Utils.log("Shutting down WebSocket server...");
  if (wss) {
    wss.clients.forEach((client) => client.terminate());
    Utils.log("WebSocket connections closed.");
  }
};

module.exports = {
  initializeWebSocket,
  broadcast,
  shutdown,
};
