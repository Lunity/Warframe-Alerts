const superagent = require("superagent");

module.exports = (bot, config, guild) => {
  const log = bot.channels.get(config.logs);
  const botcount = guild.members.filter((m) => m.user.bot).size;
  const totalcount = guild.members.size;
  if (botcount / totalcount >= 0.8) {
    log.send(["```",
`Avoided: ${guild.name} (${guild.id})`,
`Owner:   ${guild.owner.user.tag} ${guild.owner}`,
`Size:    ${guild.memberCount}\tBots: ${guild.members.filter((m) => m.user.bot).size}`,
"```"]);
    guild.leave(); // actually leave
  } else {
    log.send(["```",
`Joined: ${guild.name} (${guild.id})`,
`Owner:  ${guild.owner.user.tag} ${guild.owner}`,
`Size:   ${guild.memberCount}\tBots: ${guild.members.filter((m) => m.user.bot).size}`,
`Now in ${bot.guilds.size} guilds!`,
"```"]);
    let server_count = bot.guilds.size;
    superagent.post(`https://bots.discord.pw/api/bots/${bot.user.id}/stats`)
      .set('Authorization', config.dbottoken)
      .type('application/json')
      .send({
        server_count
      })
      .end(error => {
        console.log(`Updated bot server count to ${bot.guilds.size}`);
        if (error) console.log(error.status || error.response);
      });
  }
}
