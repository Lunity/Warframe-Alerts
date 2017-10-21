require("./util/timestamps.js");

// load libs and classes
const Discord = require("discord.js");
const config = Object.assign({}, require("./config.json"), require("./token.js")); // lul

const bot = new Discord.Client({
  messageCacheMaxSize: 50,
  disabledEvents: ["TYPING_START", "USER_UPDATE"]
});

const commands = new Map();

bot.commands = commands;
require("./util/loadEvents.js")(bot, config, "./events/");
require("./util/loadCommands.js")(commands, "./commands/");

process.on("unhandledRejection", console.error)

bot.login(config.token);
