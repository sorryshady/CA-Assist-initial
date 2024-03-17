const express = require('express');
const app = express();
const port = 3000;
const chatRoutes = require('./routes/chatRoutes');
const { wss } = require('./utilities/webSocketServer');
const http = require('http');

app.use(express.json()); // To parse JSON bodies
require('./utilities/telegramBot'); // This will start the Telegram bot

app.get('/ping', (req, res) => {
    res.status(200).send('Server is running!');
});

app.use('/api', chatRoutes);

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
});

const server = http.createServer(app);
server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(port, () => {
    console.log(`Chat-backend-api listening at http://localhost:${port}`);
    console.log('Press CTRL+C to stop the server');
}).on('error', (error) => {
    console.error('Failed to start server:', error);
});