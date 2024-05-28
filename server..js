const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

app.use(express.json());

const wss = new WebSocket.Server({ noServer: true });
let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

app.post('/webhook', (req, res) => {
  const data = req.body;
  clients.forEach(client => client.send(JSON.stringify(data)));
  res.sendStatus(200);
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
