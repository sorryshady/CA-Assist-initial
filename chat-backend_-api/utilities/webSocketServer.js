const WebSocket = require('ws');
const { WebSocketServer } = WebSocket;

const wss = new WebSocketServer({ noServer: true });
const clients = {};

wss.on('connection', function connection(ws, request) {
  const chat_id = request.url.replace('/?chat_id=', '');
  clients[chat_id] = ws;

  console.log(`WebSocket connection established for chat_id: ${chat_id}`);

  ws.on('message', function message(data) {
    console.log(`Received message ${data} from chat_id ${chat_id}`);
    // Handle incoming messages from client
  });

  ws.on('close', function close() {
    delete clients[chat_id];
    console.log(`WebSocket connection closed for chat_id ${chat_id}`);
  });

  ws.on('error', function error(err) {
    console.error(`WebSocket error for chat_id ${chat_id}:`, err);
  });
});

function findWebSocketConnectionByChatId(chat_id) {
  return clients[chat_id];
}

module.exports = { wss, findWebSocketConnectionByChatId };