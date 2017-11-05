const request = require("snekfetch");

class WorldStateManager {
	constructor() {
		this.lastUpdate = 0;
		this.ws = null;
	}

	async get() {
		if (Date.now() - this.lastUpdate >= 5 * 60e3 || this.ws === null) {
			this.ws = JSON.parse((await request.get("http://content.warframe.com/dynamic/worldState.php")).text);
		}
		return this.ws;
	}
}

module.exports = WorldStateManager;
