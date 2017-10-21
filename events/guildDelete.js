const superagent = require("superagent");

module.exports = (bot, config, guild) => {
  const log = bot.channels.get(config.logs);
  log.send(`Just left \`${guild.name}\`! Now in ${bot.guilds.size} guilds!`);
  let server_count = guild.client.guilds.size;
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
