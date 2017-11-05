const request = require("snekfetch");

class MessageManager {
	constructor() {
		this.token = process.env.DISCORD_TOKEN;
		this.funcQ = [];
		// only do requests every 3 seconds
		// this should help avoid any rate limiting
		this.interval = setInterval(this._checkQ.bind(this), 3000);
	}

	_checkQ() {
		if (this.funcQ.length === 0) {
			return;
		} else {
			const func = this.funcQ.shift();
			func(); // send the message;
		}
	}

	// this will return an array of promises
	// use Promise.all for it which will then give
	// an array of message ids and nulls
	// nulls are failed sends so we dont need those
	sendMessages(channelIds, content) {
		return channelIds.map(channelId =>
			request.post("https://discordapp.com/api/channels/" + channelId + "/messages")
				.set("Authorization", "Bot " + this.token)
				.set("Content-Type", "multipart/form-data")
				.send(JSON.stringify(content))
				.then(res =>
					res.body.channel_id + "-" + res.body.id
				)
				.catch(err => {console.error(err); return null})
		)	
	}

	deleteMessages(channelMessageIds) {
		for (const [channelId, messageId] of channelMessageIds) {
			request.delete("https://discordapp.com/api/channels/" + channelId + "/messages/" + messageId)
				.set("Authorization", "Bot " + this.token)
				.then(console.log)
				.catch(console.log);
		}
	}
}

module.exports = MessageManager;
