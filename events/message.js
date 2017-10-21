const recent_commanders = new Set();

function command_cooldown(config, user_id) {
  recent_commanders.add(user_id);
  setTimeout(() => {
    recent_commanders.delete(user_id)
  }, config.cooldown)
}

module.exports = async (bot, config, message) =>{
  const commands = bot.commands;
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(config.prefix)) {
    if (recent_commanders.has(message.author.id)) return message.reply("Wait a bit for another command");

    const [command, ...args] = message.content.slice(config.prefix.length).split(" ");
    if (commands.has(command)) {
      console.log("[COMMAND USAGE]", message.guild.name, message.channel.name, message.author.username, command, args);
      command_cooldown(config, message.author.id);
      try { commands.get(command).run(bot, message, args, commands); }
      catch(e) { message.reply("Something really bad happened, please notify `reimu#3856`: " + e); }
    } else if (command === "eval" && message.author.id === config.owner) {
      try { content = await eval(args.join(" ")); }
      catch(e) { content = e; }
      finally { message.channel.send(["```js", require("util").inspect(content), "```"]); }
    }
  }
};


