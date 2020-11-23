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
// Create new client with configuration
const client = new tmi.Client(options);

// Start bot
client.connect();

// Bot listening to incoming messages
client.on('message', (channel, userstate, message, self) => {

// Ignore messages from self (bot)
	if(self) return;

// List of commands to ignore when querying
// from the database.
  var savedCommands = [
    "following", "follow", "howlong", "hello", "followage", "hey",
    "stopannouncements", "!runannouncements", "runannouncements",
    "announcements", "runannouncement", "announcement", "runnann",
    "ann", "announce", "runannounce", "!announcements", "!runannouncement",
    "!announcement", "!runnann", "!ann", "!announce", "!runannounce"
  ];




// Setting prefix for commands => "!"
  const PREFIX = "!";

// Splitting command messages into an array
// i.e. "!command one two" => ["command", "one", "two"]
  let args = message.substring(PREFIX.length).toLowerCase().split(" ");

// Splitting command messages into a single string
// i.e. "!command one two" => "command one two"
  let cmdargs = message.substring(PREFIX.length).toLowerCase();

// Only functions for commands
// i.e. Querying the database
  if(message.startsWith("!")) {

// Opening database file
    const sqlite3 = require('sqlite3').verbose()
    let db = new sqlite3.Database('./circuitbot_db3.sqlite', (err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Connected to database.');
    });



/*                            */
/*    Functions for Database  */
/*                            */

// Querying 'set times' in database
    function dbSetTimes() {
// Queries the command "!settimes"
      db.all("SELECT Commands.execute FROM Commands WHERE Commands.name='" + "settimes" + "'", function(err, row) {
        if(err) {
          console.log(err.message)
        }
// Returns 'execute' column from command => "!settimes"
        client.say(channel, String(row[0].execute));
// Closes database
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      });
    }
// Querying every other entry in database
    function dbQuery() {
// Queries the command variable 'cmdargs'
// Since 'cmdargs' is a string, spaces are okay
// - but prefer no spaces in commands
      var db_run = "SELECT EXISTS(SELECT Commands.name FROM Commands WHERE Commands.name='" + cmdargs + "')";
// Checks to see if it exists in the database
// 1 = Exists in database
// 0 = Not in database
      db.all(db_run, (err, value) => {
        if(err) {
          console.log(err.message);
        }
// When value = 1 => return 'execute' of command
        else if((Object.values(value[0])[0]) === 1) {
          db.all("SELECT Commands.execute FROM Commands WHERE Commands.name='" + cmdargs + "'", function(err, row) {
            if(err) {
              console.log(err.message)
            }
// Returns 'execute' column from command
            client.say(channel, String(row[0].execute));
// Closes database
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          });
        }
// When value = 0 => query not in database
        else if((Object.values(value[0])[0]) === 0) {
// Check if in saved commands list => do nothing
          if(savedCommands.includes(cmdargs)) {
            console.log('Command used elsewhere.');
// Closes database
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          }
// If start of string = "!" => i.e. "!!", do nothing
          else if(args[0].startsWith("!")) {
            console.log('String of exclamation marks.');
// Closes database
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          }
// If end of string = "!" => i.e. "! OMG !", do nothing
          else if(args[0].endsWith("!")) {
            console.log('String of exclamation marks.');
// Closes database
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          }
// If string includes extra special characters
// i.e. "!@#$ YOU", do nothing
          else if(/[~`!@#$%\^&*\(\)+=\[\]\\';,/{}|\\":<>\?]/g.test(args[0])) {
            console.log('Special characters.');
// Closes database
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          }
// If string isn't in saved commands
          else if(!savedCommands.includes(cmdargs)) {
// If string equals exactly "runannouncements", do nothing
            if(args[0] === "runannouncements") {
              console.log('Command used elsewhere.');
// Closes database
              db.close((err) => {
                if(err) {
                  console.log(err.message);
                }
                console.log('Closed database.');
              });
            }
// If string is in announcement list, do nothing
            else if(announcements.includes(args[0])) {
              console.log('Command used elsewhere.');
// Closes database
              db.close((err) => {
                if(err) {
                  console.log(err.message);
                }
                console.log('Closed database.');
              });
            }
// If none of the above, reply with "couldn't find in database"
            else {
              client.say(channel, "/me Couldn't find command in database.");
// Close database
              db.close((err) => {
                if(err) {
                  console.log(err.message);
                }
                console.log('Closed database.');
              });
            }
          }
        }
      });
    }
// Add command function (currently not working)
    function dbAddCommand() {
      let invarg = message.toLowerCase().split(" ");
      if(args.length < 2) {
        client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
        client.say(channel, '/me !addcomm [!command] [text]');
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      }
      else if(!args[1].startsWith("!")) {
        client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
        client.say(channel, '/me !addcomm [!command] [text]');
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      }
      else if(args[1].startsWith("!")) {

        //////// SPLITS NEW COMMAND FROM STRING //////
        let argscomm = args[1].substring(PREFIX.length).toLowerCase();

        ////// SPLITS THE EXECUTE FROM STRING ///////
        let argstat = message.split(" ").slice(2).join(" ");
        //client.say(channel, argstat);

        var addcomm_run = "SELECT EXISTS(SELECT Commands.name FROM Commands WHERE Commands.name='" + argscomm + "')";
        db.all(addcomm_run, (err, value) => {
          if(err) {
            console.log(err.message);
          }
          if((Object.values(value[0])[0]) === 1) {
            console.log('Command already in database.');
            client.say(channel, 'Command already in database.');
            db.close((err) => {
              if(err) {
                console.log(err.message);
              }
              console.log('Closed database.');
            });
          }

    //////////// ERROR HERE: SQLITE_MISUSE: Database handle is closed ////////
    /////////////////////////////////////////////////////////////////////////
          else if((Object.values(value[0])[0]) === 0) {
            db.serialize(function() {
              db.run("BEGIN TRANSACTION;");
              console.log('Transaction begun.');
              db.run("INSERT OR IGNORE INTO Commands (name, execute) VALUES (?,?);", [argscomm, argstat], function(err) {
                if (err) {
                  console.log(err.message);
                }
              });
              console.log('Data inserted.');
              db.run("COMMIT;");
              console.log('Commit complete.');
              db.close((err) => {
                if(err) {
                  console.log(err.message);
                }
                console.log('Closed database.');
              });
            });
            client.say(channel, "Command: !" + argscomm + " has been added to the database.");
          }

        });
      }
    }
// Update command function (currently not working)
    function dbUpdateCommand() {
      if(args.length < 2) {
        client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
        client.say(channel, '/me !update [!command] [text]');
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      }
      else if(!args[1].startsWith("!")) {
        client.say(channel, 'Command must begin with an exclamation mark (!). Use the following guidelines:');
        client.say(channel, '/me !update [!command] [text]');
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      }
      else if(args[1].startsWith("!")) {
        client.say(channel, "Update feature not implemented yet.");
        db.close((err) => {
          if(err) {
            console.log(err.message);
          }
          console.log('Closed database.');
        });
      }
    }
// Add command function (currently not working)
    if(args[0] === "addcomm") {
      if(args[0] === "addcomm") {     /// temporary to hide other code
        client.say(channel, "'Add Command' feature not yet implemented.");
      }
      ////// HIDDEN CODE ///
      else if(args[0] === "test") {     /// this code will never excute
        dbAddCommand();
      }
    }
// Update command function (currently not working)
    else if(args[0] === "update") {
      if(args[0] === "update") {      /// temporary to hide other code
        client.say(channel, "'Update Command' feature not yet implemented.");
      }
      ////// HIDDEN CODE ///
      else if(args[0] === "test") {     /// this code will never excute
        dbUpdateCommand();
      }

    }
// Query database
    else {
      let settimes = [
        "settimes", "times", "set times", "set", "lineup", "line up", "line-up", "set-times"
      ]
      if(args[0] < 1) {
        console.log('Not a command.');
      }
      // set times commands
      else if(settimes.includes(args[0])) {
        dbSetTimes();
      }
      else {
        dbQuery();
      }
    }

  }


// Delete spam messages
// i.e. bigfollows*com https://clck.ru/R9gQV
// i.e. bigfollows*com https://goo.su/2qsf
  let spamBotMessages = [
    "bigfollows*com", "https://clck.ru/R9gQV",
    "https://goo.su/2qsf"
  ];
  if(spamBotMessages.some(spamBotMessage => message.includes(spamBotMessage))) {
    client.deletemessage(channel, userstate.id)
    .then((data) => {
      // data returns [channel]
    }).catch((err) => {
      //
    });
  }

// Show all 'userstate' objects in console.log
  if(message.toLowerCase() === "show me the userstate objects") {
    console.log(JSON.stringify(userstate));
  }







/*                              */
/*  Announcement loop functions */
/*                              */
  var announcementLoop = {
// Posts discord link in chat
    discord:function() {
      client.say(channel, "Join Circuit's Discord server: https://discord.gg/8nmGRVw"); // returns after 7mins
    },
// Posts facebook link in chat
    facebook:function() {
      client.say(channel, "Follow Circuit on Facebook: https://facebook.com/CircuitAZ");
    },
// Posts twitter link in chat
    twitter:function() {
      client.say(channel, "Follow Circuit on Twitter: https://twitter.com/CircuitAZ");
    },
// Posts instagram link in chat
    instagram:function() {
      client.say(channel, "Follow Circuit on Instagram: https://instagram.com/CircuitAZ");
    },
// First loop of announcements
    stepOne:function() {
      setTimeout(announcementLoop.discord, 1000); // Run now
      setTimeout(announcementLoop.facebook, 600000); // Run in 10mins
      setTimeout(announcementLoop.stepTwo, 600000); // Run when Facebook starts/ends
    },
// Second loop of announcements
    stepTwo:function() {
      setTimeout(announcementLoop.discord, 600000); // Run in 10mins
      setTimeout(announcementLoop.instagram, 1200000); // Run in 20mins
      setTimeout(announcementLoop.stepThree, 1200000); // Runs when Instagram starts/ends
    },
// Third loop of announcements
    stepThree:function() {
      setTimeout(announcementLoop.discord, 600000); // Run in 10mins
      setTimeout(announcementLoop.twitter, 1200000); // Run in 20mins
    }
  }
// Calling the command to run announcement loop
  function runAnn() {
    let i = 1;
// Has to be a number, i.e. "!announce 12"
    if(isNaN(args[1])) {
      client.say(channel, "/me Must be valid number in hours: !runannouncements [# of hrs]");
    }
// If it is a number, then do this
    else if(!isNaN(args[1])) {
// If number over 12, throw error in chat
      if(Number(args[1]) > 12) {
        client.say(channel, "/me Cannot exceed 12hours. Please try again.");
      }
// If number under 1, throw error in chat
      else if(Number(args[1]) < 1) {
        client.say(channel, "/me Must be 1 or more hours. Please try again.");
      }
// Number has to be a whole integer, throw error if not
      else if(args[1].includes(".")) {
        client.say(channel, "/me Must be a whole number. Please try again.");
      }
// If none of the above, run announcements for number of hours
      else {
        let j = Number(args[1]) + 1;
        setTimeout(function run() {
          console.log("Number of loops: " + i);
          if(i<j) {
            i++;
            announcementLoop.stepOne();
            setTimeout(run, 3600000); // run every 60mins
          }
        }, 1000);
        client.say(channel, "Running announcements for " + args[1] + " hours.");
      }
    }
  }
// List of commands that can call this function
  let announcements = [
    "runannouncements", "announcements", "runannouncement",
    "announcement", "runnann", "ann", "announce", "runannounce"
  ];
// Calling the announcement loop function
  if(announcements.includes(args[0])) {
    if(announcements.includes(args[0])) {
// Only mods can call this function
      if(userstate.mod) {
        runAnn()
      }
// Can make only one user call this function
      // else if(userstate.username === "theblindhobo_") {
      //   runAnn()
      // }
// If anyone else tries to use this function, throw error in chat
      else {
        client.say(channel, "/me Must be a mod to complete this action.");
      }
    }
  }









// Default 'hello' commands
// Can delete if want
	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${userstate.username}, heya!`);
	}
  else if(message.toLowerCase() === '!hey') {
    // "@alca, heya!"
    client.say(channel, `@${userstate.username}, heya!`);
  }




/*   Simple greeting replies                          */
/*    i.e. Users says 'hello' or 'hey guys' in chat   */
/*                 then bot replies with 'heya!'      */
// List of different first word greetings
  var greetings = [
    "hey", "hey!", "hey!!", "hey!!!",
    "heyy", "heyy!", "heyy!!", "heyy!!!",
    "heyyy", "heyyy!", "heyyy!!", "heyyy!!!",
    "hello", "hello!", "hello!!", "hello!!!",
    "helloo", "helloo!", "helloo!!", "helloo!!!",
    "hellooo", "hellooo!", "hellooo!!", "hellooo!!!",
    "hi", "hi!", "hi!!", "hi!!!",
    "hii", "hii!", "hii!!", "hii!!!",
    "hiii", "hiii!", "hiii!!", "hiii!!!",
    "yo", "yo!", "yo!!", "yo!!!",
    "yoo", "yoo!", "yoo!!", "yoo!!!",
    "yooo", "yooo!", "yooo!!", "yooo!!!",
    "yeo", "yeo!", "yeo!!", "yeo!!!",
    "yeoo", "yeoo!", "yeoo!!", "yeoo!!!",
    "yeooo", "yeooo!", "yeooo!!", "yeooo!!!",
    "heya", "heya!", "heya!!", "heya!!!",
    "heyaa", "heyaa!", "heyaa!!", "heyaa!!!",
    "heyya", "heyya!", "heyya!!", "heyya!!!",
    "heyyaa", "heyyaa!", "heyyaa!!", "heyyaa!!!",
    "hiya", "hiya!", "hiya!!", "hiya!!!",
    "hiyaa", "hiyaa!", "hiyaa!!", "hiyaa!!!",
    "hiyya", "hiyya!", "hiyya!!", "hiyya!!!",
    "hiyyaa", "hiyyaa!", "hiyyaa!!", "hiyyaa!!!",
    "sup", "sup!", "sup!!", "sup!!!",
    "supp", "supp!", "supp!!", "supp!!!",
    "suppp", "suppp!", "suppp!!", "suppp!!!"
  ];
// List of different second word greetings
  var greetGuys = [
    "guys", "guys!", "guys!!", "guys!!!",
    "guyys", "guyys!", "guyys!!", "guyys!!!",
    "guyyys", "guyyys!", "guyyys!!", "guyyys!!!",
    "guyss", "guyss!", "guyss!!", "guyss!!!",
    "guyyss", "guyyss!", "guyyss!!", "guyyss!!!",
    "guyysss", "guyysss!", "guyysss!!", "guyysss!!!"
  ];
// Creating an array from the message (last entry is always blank space)
  var greetMsg = (message.toLowerCase() + " ").split(" ");
// If array is a single word (plus the blank space), do this
  if(greetMsg.length < 3) {
// If first word is included in the formed array
    if(greetings.includes(greetMsg[0])) {
      client.say(channel, `@${userstate.username}, heya!`);
    }
// If first word is twitch emoji 'HeyGuys'
    else if(greetMsg[0] === "HeyGuys") {
      client.say(channel, `@${userstate.username}, heya!`);
    }
  }
// If array is two words (plus the blank space), do this
  else if(greetMsg.length < 4) {
// First entry of array is included in the list
    if(greetings.includes(greetMsg[0])) {
// Second entry of array is included in the other list
      if(greetGuys.includes(greetMsg[1])) {
        client.say(channel, `@${userstate.username}, hey fam!`);
      }
    }
// Otherwise ignore and do nothing
  }





/*                          */
/*    Replying to the bot   */
/*                          */
// User mentions the bots name, quirky reply
  if(message.toLowerCase().includes(`@circuit__bot`)) {
    client.say(channel, 'You talkin bout me?')
  }
// Alternative way to mention bot, with separate reply
  else if(message.toLowerCase().includes(`circuitbot`)) {
    client.say(channel, 'Who? MEEE??')
  }
// Another alternative way to mention bot, with separate response
  else if(message.toLowerCase().includes(`circuit bot`)) {
    client.say(channel, 'I heard that!')
  }



















// List of 'Circuit' words to respond to
  var circuitWords = [
    "circuit", "circuit!", "circuit!!", "circuit!!!",
    "circuitt", "circuitt!", "circuitt!!", "circuitt!!!",
    "circuittt", "circuittt!", "circuittt!!", "circuittt!!!",
    "circuit!!!!", "circuitt!!!!", "circuittt!!!!", "circuitttt!!!!"
  ];
// List of 'Sucio' words to respond to
  var sucioWords = [
    "sucio", "sucioo", "suciooo", "sucioooo",
    "sucio!", "sucioo!", "suciooo!", "sucioooo!",
    "sucio!!", "sucioo!!", "suciooo!!", "sucioooo!!",
    "sucio!!!", "sucioo!!!", "suciooo!!!", "sucioooo!!!"
  ];
// List of 'Techno' words to respond to
  var technoWords = [
    "techno", "techno!", "techno!!", "techno!!!",
    "technoo", "technoo!", "technoo!!", "technoo!!!",
    "technooo", "technooo!", "technooo!!", "technooo!!!",
    "technnoo", "technnoo!", "technnoo!!", "technnoo!!!",
    "technnooo", "technnooo!", "technnooo!!", "technnooo!!!",
    "techno!!!!", "technoo!!!!", "technooo!!!!", "technnoo!!!!",
    "technnooo!!!!"
  ];

// Forming the message array
  let msgq = message.toLowerCase().split(" ");

// Check message to see if includes 'Circuit' words from list
  if(circuitWords.some(circuitWord => msgq.includes(circuitWord))) {
// Replies with Circuit emojis (must be subscribed)
    client.say(channel, 'circui12Techno circui12Techno circui12Techno');
  }
// Check message to see if includes 'Sucio' words from list
  else if(sucioWords.some(sucioWord => msgq.includes(sucioWord))) {
    client.say(channel, 'Esteban sucio! BOP');
  }
// Check message to see if includes 'Techno' words from list
  else if(technoWords.some(technoWord => msgq.includes(technoWord))) {
    client.say(channel, "El niño maquina.");
  }










// List of "Follow" words to run function
  var followWords = [
    "!followage", "!follow", "!following", "!howlong"
  ];
// Checks message for "Follow" words, then runs function
  if(followWords.some(followWord => message.toLowerCase() === followWord)) {
// Runs API query to see how long user has been following the twitch user
    const follurl = ("https://2g.be/twitch/following.php?" + "user=" + userstate.username + "&channel=" + 'circuitaz' + "&format=ymwd");
    fetch(follurl)
    .then((resp) => resp.text())
    .then(data => (client.say(channel, data)));
  }





});
