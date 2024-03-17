const db = require('../database/db');
const { generateChatId, notifyCAs } = require('../utilities/chatUtilities');
const telegramBot = require('../utilities/telegramBot');
const { findWebSocketConnectionByChatId } = require('../utilities/webSocketServer');
const upload = require('../utilities/multerConfig'); // Import Multer config

exports.connect = async (req, res) => {
  const { firstName, lastName, panNumber, preferredLanguage, secondaryLanguage } = req.body;
  
  console.log(`Attempting to connect client: ${firstName} ${lastName} with preferred language: ${preferredLanguage}`);
  
  // Check if the client is already in a conversation
  db.get(`SELECT * FROM Chat_sessions WHERE ClientPAN = ?`, [panNumber], async (err, session) => {
    if (err) {
      console.error('Error querying Chat_sessions:', err);
      return res.status(500).send('Internal server error');
    }
    if (session) {
      console.log(`Client ${panNumber} is already in a conversation`);
      return res.status(409).send('Client is already in a conversation');
    }

    // Find matching CAs based on language preferences
    db.all(`SELECT TelegramID FROM "CA-helpers" WHERE PrimaryLanguage = ? OR SecondaryLanguage = ?`, [preferredLanguage, secondaryLanguage], async (err, matches) => {
      if (err) {
        console.error('Error querying CA-helpers for matches:', err);
        return res.status(500).send('Internal server error');
      }
      if (matches.length === 0) {
        console.log(`No matching CAs found for languages: ${preferredLanguage}, ${secondaryLanguage}`);
        return res.status(404).send('No matching CAs found');
      }

      const chatId = generateChatId();
      const telegramIds = matches.map(match => match.TelegramID).join(',');

      console.log(`Matched ${matches.length} CAs for client ${panNumber}. Storing in Chat-matches with Chat ID ${chatId}`);

      // Store the match in the "Chat-matches" database
      db.run(`INSERT INTO "Chat-matches" (ChatID, ClientPAN, TelegramIDs) VALUES (?, ?, ?)`, [chatId, panNumber, telegramIds], async (err) => {
        if (err) {
          console.error('Error storing chat match in Chat-matches:', err);
          return res.status(500).send('Error storing chat match');
        }
        
        // Notify matched CAs via the Telegram bot
        console.log(`Notifying matched CAs for chat ID ${chatId}`);
        notifyCAs(matches, chatId);

        res.status(200).send({ chatId });
      });
    });
  });
};

exports.chat = async (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      console.error('Error uploading file', err);
      res.status(400).send({ error: 'Error uploading file' });
    } else {
      const { chat_id, type } = req.body;
      if (type === 'message' && req.body.message) {
        db.get(`SELECT MatchedCATelegramID FROM "Chat_sessions" WHERE ChatID = ?`, [chat_id], (err, session) => {
          if (err || !session) {
            console.error('Chat session not found.', err);
            return res.status(404).send('Chat session not found.');
          }
          telegramBot.sendMessage(session.MatchedCATelegramID, req.body.message).then(() => {
            console.log(`Message sent to CA via Telegram bot.`);
            res.sendStatus(200);
          }).catch(error => {
            console.error('Error sending message to CA via Telegram bot', error);
            res.status(500).send('Failed to send message to CA.');
          });
        });
      } else if (type === 'file' && req.file) {
        db.get(`SELECT MatchedCATelegramID FROM "Chat_sessions" WHERE ChatID = ?`, [chat_id], (err, session) => {
          if (err || !session) {
            console.error('Chat session not found.', err);
            return res.status(404).send('Chat session not found.');
          }
          telegramBot.sendDocument(session.MatchedCATelegramID, req.file.path).then(() => {
            console.log(`File sent to CA via Telegram bot.`);
            res.sendStatus(200);
          }).catch(error => {
            console.error('Error sending file to CA via Telegram bot', error);
            res.status(500).send('Failed to send file to CA.');
          });
        });
      } else {
        console.log('Invalid type specified or no content provided.');
        res.status(400).send('Invalid type specified or no content provided.');
      }
    }
  });
};

exports.disconnect = async (req, res) => {
  const { chat_id } = req.body;

  db.get(`SELECT * FROM "Chat_sessions" WHERE ChatID = ?`, [chat_id], async (err, session) => {
    if (err) {
      console.error('Error querying Chat_sessions:', err);
      return res.status(500).send('Internal server error');
    }
    if (!session) {
      return res.status(404).send('Chat session not found');
    }

    const caTelegramId = session.MatchedCATelegramID;

    // Remove the chat session from the database
    db.run(`DELETE FROM "Chat_sessions" WHERE ChatID = ?`, [chat_id], (err) => {
      if (err) {
        console.error('Error removing chat session:', err);
        return res.status(500).send('Failed to disconnect the chat');
      }

      // Notify CA about the disconnection
      telegramBot.sendMessage(caTelegramId, `Chat with ID: ${chat_id} has been disconnected.`)
        .then(() => {
          console.log(`Notification sent to CA with Telegram ID: ${caTelegramId}`);
        })
        .catch(error => {
          console.error('Error sending notification to CA:', error);
        });

      // Ideally, notify the client via WebSocket if connected
      const clientSocket = findWebSocketConnectionByChatId(chat_id);
      if (clientSocket) {
        clientSocket.send(JSON.stringify({ type: 'disconnect', message: 'Chat has been disconnected.' }), error => {
          if (error) {
            console.error('Error sending disconnection message to client via WebSocket', error);
          }
        });
      }

      res.sendStatus(200);
    });
  });
};