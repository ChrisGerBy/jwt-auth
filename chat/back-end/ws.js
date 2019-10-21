const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('connected');
  ws.on('message', (message) => {
    server.clients.forEach((client) => {
      client.send(message);
    });
  });
});
