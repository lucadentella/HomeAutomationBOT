// Authorized users, replace with your real IDs
var authorized_users = [
  111111111,
];

// Include required libraries
var sensorLib = require('node-dht-sensor');
var Bot = require('node-telegram-bot');

// Initialize relay board (using onoff library)
var Gpio = require('onoff').Gpio,
  relay1 = new Gpio(2, 'out'),
  relay2 = new Gpio(3, 'out');

// Turn both the relays off
relay1.writeSync(0);
relay2.writeSync(0);

// Initialize DHT11 sensor
sensorLib.initialize(11, 4);

// Initialize and start Telegram BOT (insert your real token)
var bot = new Bot({
  token: '0123456789abcdef0123456789abcdef0123456789ab'
});

// Attach event on every received message 
bot.on('message', function (message) {
  parseMessage(message);
});

// Start the bot
bot.start();
console.log("BOT ready!");

// Function that handles a new message
function parseMessage(message) {

  if(!isAuthorized(message.from.id)) return;

  switch(true) {
  
    case message.text == "/gettemp":
      bot.sendMessage({
        chat_id: message.chat.id,
        text: 'Actual temperature: ' + sensorLib.read().temperature.toFixed(0) + '°C',
      });
      break;

    case message.text == "/gethum":
      bot.sendMessage({
        chat_id: message.chat.id,
        text: 'Actual humidity: ' + sensorLib.read().humidity.toFixed(0) + '%',
      });
      break;

    case message.text == "/getouts":
      bot.sendMessage({
        chat_id: message.chat.id,
        text: 'Actual outputs status:\nOutput 1 is ' + relay1.readSync() + '\nOutput 2 is ' + relay2.readSync(),
      });
      break;

    case /^\/setout1/.test(message.text):
      var command = message.text.replace("/setout1 ", "");
      if(command.toLowerCase() == "on") {
        relay1.writeSync(1);
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Output 1 turned ON',
        });
      } else if(command.toLowerCase() == "off") {
        relay1.writeSync(0);
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Output 1 turned OFF',
        });
      } else
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Unknown command: ' + command,
        });    
    break;

    case /^\/setout2/.test(message.text):
      var command = message.text.replace("/setout2 ", "");
      if(command.toLowerCase() == "on") {
        relay2.writeSync(1);
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Output 2 turned ON',
        });
      } else if(command.toLowerCase() == "off") {
        relay2.writeSync(0);
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Output 2 turned OFF',
        });
      } else
        bot.sendMessage({
          chat_id: message.chat.id,
          text: 'Unknown command: ' + command,
        });
    break;
  }
}


// Function that checks if the user is authorized (its id is in the array)
function isAuthorized(userid) {

  for(i = 0; i < authorized_users.length; i++) 
    if(authorized_users[i ] == userid) return true;
 
  return false;
}
