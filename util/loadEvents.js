const fs = require("fs");
const tasks = require("../autotasks/Auto.js");

function reqEvents(bot, dir, config) {
  fs.readdir(dir, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = file.slice(0, -3);
      console.log(`[EVENT LOAD] ${event}`);
      if (event !== "ready")
        bot.on(event, (require(`../events/${file}`).bind(null, bot, config)));
      else
        bot.once(event, (require(`../events/${file}`).bind(null, bot, config, tasks)));
    })
  })
}
// reqEvents("./events/");
// ok lol
module.exports = (client, config, dir) => reqEvents(client, dir, config);
