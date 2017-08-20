module.exports = {
  name: "about",
  desc: "bot info and changelog",
  example: "about",
  run: (bot, message, args, commands) => {
    message.channel.send({embed: new (require("discord.js")).RichEmbed()
      .setColor(Math.random() * 0xffffff)
      .setURL("https://bots.discord.pw/bots/267451911840595980")
      .setTitle("Homepage")
      .addField("Questions/Suggestions?", "Contact reimu#3856\nDirect Messages > Friends > Add Friend\nOr join my server ```https://discord.gg/Zct6VgD```")
      .setFooter("* - give or take 5-10 minutes. This is still a work in progress, expect some changes!")
    })
  }
}
