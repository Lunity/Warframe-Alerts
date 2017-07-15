const decks = require("../../datamine/mission_decks.json");

module.exports = {
  name: "rewards",
  desc: "search mission/relic rewards",
  example: "rewards venom, rewards nova prime systems",
  run: (bot, message, args) => {
    const searchTerm = args.join(" ").toLowerCase();
    const rewards = [];
    for (obj in decks) {
      for (key in decks[obj]) {
        if (key === "Locations") continue;
        for (let i = 0; i < decks[obj][key].length; i++) {
          const val = decks[obj][key][i];
          if (val.toLowerCase().includes(searchTerm)) {
            try { rewards.push(...decks[obj].Locations.map(l => l.split(",").slice(0, 2).join(",") + " - " + val.split(",")[0])); }
            catch(e) { }
            break;
          }
        }
      }
    }
    message.channel.send(["```haskell",
      `rewards that include the term ${searchTerm.toUpperCase()} can be found at:`,
      rewards.length > 0 ? rewards.join("\n") : "NOWHERE",
      "tip: Try ',search mis LOCATION' for more reward info```"
    ]).catch((err) => {
      message.channel.send("The response is too long to be sent. Please try a more specific term.");
    })
  }
}
