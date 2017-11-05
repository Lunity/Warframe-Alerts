class AlertManager {
	constructor(db, mm) {
		this.db = db;
		this.messageManager = mm;
	}

	// delete messages
	// then delete guid from events
	// and because of cascade everything else should be cleaned up
	cleanAlerts() {
		this.db.query("select messages from events, messages where events.expirdate <= now() and events.guid = messages.guid")
			// some fancy way to flatten arrays that are singly nested
			.then(res => {
				const ids = [].concat.apply([], res.rows.map(r => r.messages.split(",").map(e => e.split("-"))));
				this.messageManager.funcQ.push(() =>
					this.messageManager.deleteMessages(ids)
				);
			})
	}

	addAlert(guid, platform, author, rewards, loc, date, description) {
		this.messageManager.funcQ.push(() => {
			this.db.query("insert into events (guid, platform, author, rewards, location, expirDate, description) \
				values ($1, $2, $3, $4, $5, to_timestamp($6), $7)", [guid, platform, author, rewards, loc, date, description])
				.then(res =>
					this.db.query("select channel_id from channels where (platforms & $1) = $1", [1 << platform])
				)
				.then(res =>
						Promise.all(this.messageManager.sendMessages(res.rows.map(r => r.channel_id), {
							"content": "",
							"embed": {
								"description":["```diff",
									"-!- [Alert] -!-",
									"+ " + description,
									"+ " + loc,
									"*** [Rewards] ***",
									"+ " + rewards,
									"```"
								].join("\n"),
								"footer": {
									"text": guid + " | Expires at "
								},
								"timestamp": new Date(date * 1000)
							}
						}))
				)
				.then(messageids =>
					// remove nulls from messageids
					this.db.query("insert into messages (guid, messages) values ($1, $2)", [guid, messageids.filter(e => e).join(",")])
				)
				.catch(console.error);
		});
	}
}

module.exports = AlertManager;
