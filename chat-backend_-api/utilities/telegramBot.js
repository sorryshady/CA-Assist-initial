const TelegramBot = require('node-telegram-bot-api');
const CAHelperModel = require('../models/caHelperModel');
const db = require('../database/db');
const token = '6926636975:AAHC2nEsvuGQCDwnJ1Uz0Cmf0T3OYevzR50'; // Replace YOUR_TELEGRAM_BOT_TOKEN_HERE with your actual Telegram bot token
const bot = new TelegramBot(token, {polling: true});

let registrationSteps = {};
let caDetails = {};

bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  registrationSteps[chatId] = 'firstName';
  caDetails[chatId] = {};
  bot.sendMessage(chatId, 'Please enter your first name:').catch((error) => {
    console.error('Error sending message:', error);
  });
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text || msg.text.startsWith('/')) return;

  if (registrationSteps[chatId]) {
    switch (registrationSteps[chatId]) {
      case 'firstName':
        caDetails[chatId].firstName = msg.text;
        registrationSteps[chatId] = 'lastName';
        bot.sendMessage(chatId, 'Please enter your last name:').catch((error) => {
          console.error('Error sending message:', error);
        });
        break;
      case 'lastName':
        caDetails[chatId].lastName = msg.text;
        registrationSteps[chatId] = 'panNumber';
        bot.sendMessage(chatId, 'Please enter your PAN number:').catch((error) => {
          console.error('Error sending message:', error);
        });
        break;
      case 'panNumber':
        try {
          const existingCA = await CAHelperModel.findByPAN(msg.text);
          if (existingCA) {
            bot.sendMessage(chatId, 'This PAN number is already registered.').catch((error) => {
              console.error('Error sending message:', error);
            });
            delete registrationSteps[chatId];
            delete caDetails[chatId];
            break;
          }
          caDetails[chatId].panNumber = msg.text;
          registrationSteps[chatId] = 'primaryLanguage';
          bot.sendMessage(chatId, 'Please enter your primary language:').catch((error) => {
            console.error('Error sending message:', error);
          });
        } catch (error) {
          console.error('Error checking PAN number:', error);
          bot.sendMessage(chatId, 'There was an error processing your PAN number. Please try again.').catch((error) => {
            console.error('Error sending message:', error);
          });
        }
        break;
      case 'primaryLanguage':
        caDetails[chatId].primaryLanguage = msg.text;
        registrationSteps[chatId] = 'secondaryLanguage';
        bot.sendMessage(chatId, 'Please enter your secondary language:').catch((error) => {
          console.error('Error sending message:', error);
        });
        break;
      case 'secondaryLanguage':
        caDetails[chatId].secondaryLanguage = msg.text;
        registrationSteps[chatId] = null;

        try {
          await CAHelperModel.insert({
            TelegramID: chatId.toString(),
            FirstName: caDetails[chatId].firstName,
            LastName: caDetails[chatId].lastName,
            CAPANNumber: caDetails[chatId].panNumber,
            PrimaryLanguage: caDetails[chatId].primaryLanguage,
            SecondaryLanguage: caDetails[chatId].secondaryLanguage,
          });
          bot.sendMessage(chatId, 'Thank you! You are now registered.').catch((error) => {
            console.error('Error sending message:', error);
          });
        } catch (error) {
          console.error('Error registering CA:', error);
          bot.sendMessage(chatId, 'There was an error during the registration. Please try again.').catch((error) => {
            console.error('Error sending message:', error);
          });
        }

        delete caDetails[chatId];
        break;
      default:
        bot.sendMessage(chatId, 'Registration process error. Please start over.').catch((error) => {
          console.error('Error sending message:', error);
        });
        delete registrationSteps[chatId];
        delete caDetails[chatId];
    }
  }
});

bot.onText(/\/accept (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const acceptChatId = match[1]; // Extracted Chat ID from the message

  // Check if the CA is already engaged in a chat session
  const isEngaged = await new Promise((resolve, reject) => {
    db.get(`SELECT * FROM "Chat_sessions" WHERE MatchedCATelegramID = ?`, [chatId.toString()], (err, row) => {
      if (err) {
        console.error('Error querying Chat_sessions:', err);
        reject(err);
      }
      resolve(row ? true : false);
    });
  });

  if (isEngaged) {
    bot.sendMessage(chatId, 'You are already engaged in a chat session.').catch((error) => {
      console.error('Error sending message:', error);
    });
    return;
  }

  try {
    const matchExists = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM "Chat-matches" WHERE ChatID = ?`, [acceptChatId], (err, row) => {
        if (err) {
          console.error('Error querying Chat-matches:', err);
          reject(err);
        }
        resolve(row);
      });
    });

    if (!matchExists) {
      bot.sendMessage(chatId, 'No such chat request or it has already been accepted.').catch((error) => {
        console.error('Error sending message:', error);
      });
      return;
    }

    // Move the chat session from "Chat-matches" to "Chat_sessions"
    const insertIntoChatSessions = await new Promise((resolve, reject) => {
      db.run(`INSERT INTO "Chat_sessions" (ChatID, ClientPAN, MatchedCATelegramID) VALUES (?, ?, ?)`, [acceptChatId, matchExists.ClientPAN, chatId.toString()], (err) => {
        if (err) {
          console.error('Error inserting chat session into Chat_sessions:', err);
          reject(err);
        }
        resolve(true);
      });
    });

    if (insertIntoChatSessions) {
      db.run(`DELETE FROM "Chat-matches" WHERE ChatID = ?`, [acceptChatId], (err) => {
        if (err) {
          console.error('Error deleting chat match from Chat-matches:', err);
        }
      });

      bot.sendMessage(chatId, 'You have successfully accepted the chat request.').catch((error) => {
        console.error('Error sending accept message:', error);
      });
    }
  } catch (error) {
    console.error('Error processing accept command:', error);
    bot.sendMessage(chatId, 'Failed to process accept command. Please try again.').catch((error) => {
      console.error('Error sending failure message:', error);
    });
  }
});

bot.on('polling_error', (error) => {
  console.error('Telegram bot polling error:', error);
});

module.exports = bot;