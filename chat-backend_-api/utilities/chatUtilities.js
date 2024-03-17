const bot = require('./telegramBot'); // Ensure this exports the bot instance

const generateChatId = () => {
  console.log('Generating chat ID.');
  return Math.random().toString(36).substring(2, 12);
};

const notifyCAs = (matches, chatId) => {
  console.log(`Notifying CAs about new chat request: ${chatId}`);
  matches.forEach(match => {
    bot.sendMessage(match.TelegramID, `You have a new chat request. Chat ID: ${chatId}. Type /accept ${chatId} to accept.`)
      .then(() => {
        console.log(`Notification sent to CA with Telegram ID: ${match.TelegramID}`);
      })
      .catch(error => {
        console.error('Error sending notification to CA:', error);
      });
  });
};

module.exports = { generateChatId, notifyCAs };