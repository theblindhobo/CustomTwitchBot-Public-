console.log('App started.')

import { CHANNEL_NAME , OAUTH_TOKEN , BOT_USERNAME , CHANNEL_OWNER_NAME , BLOCKED_WORDS } from './constants'
import tmi from 'tmi.js'
// const tmi = require('https://github.com/theblindhobo/Circuit__BOT/blob/master/tmi.js/index.js');
import fetch from 'node-fetch'


// Client configuration
const options = {
  options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
};

// Create new client
const client = new tmi.Client(options);



/*                                       */
/*      Querying from a JSON file        */
/*                                       */
/* JSON Database (currently not in use)  */
import json from './circuitbot-database.json'
const str_json = JSON.stringify(json);
const obj_json = JSON.parse(str_json);
var arr = obj_json.commands;

// Start client
client.connect();

// Client listening to messages
client.on('message', (channel, userstate, message, self) => {

// JSON query
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    if(message.toLowerCase() === ('!' + obj.command)) {
      client.say(channel, obj.execute);
    }
  }

});
