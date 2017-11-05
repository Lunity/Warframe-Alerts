class InvasionManager {
	constructor(db) {
		this.db = db;
		this.guids = new Set();
	}

	addInvasion(guid, platform, author, rewards, loc) {
		this.db.query("insert into events (guid, platform, author, rewards, location) \
			values ($1, $2, $3, $4, $5)", [guid, platform, author, rewards, loc])
			.then(res =>
				this.db.query("select channel_id from channels where (platforms & $1) = $1", [1 << platform])
			)
			.then(res => {
				// console.log(res.rows.map(r => r.channel_id));
			})
			.catch(() => {});
	}
}

module.exports = InvasionManager;
