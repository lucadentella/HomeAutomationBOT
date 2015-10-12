// Include required libraries
var Bot = require('node-telegram-bot');

// Initialize and start Telegram BOT (insert your real token)
var bot = new Bot({
  token: '0123456789abcdef0123456789abcdef0123456789ab'
});

// Attach event on every received message 
bot.on('message', function (message) {
  echo(message);
});

// Start the bot
bot.start();
console.log("BOT ready!");

// Function that handles a new message
function echo(message) {
  
  bot.sendMessage({
	  chat_id: message.chat.id,
	  text: 'User ID ' + message.from.id + ' says "' + message.text + '"',
  });
}
