const request = require("snekfetch");
const {Client} = require("pg");
const {parseString} = require("xml2js");
const AlertManager = require("./AlertManager");
const InvasionManager = require("./InvasionManager");
const MessageManager = require("./MessageManager");

class EventManager {
	constructor() {
		this.db = new Client({
			connectionString: process.env.DATABASE_URL,
			ssl: true
		});
		this.db.connect();
		this.messageManager = new MessageManager();
		this.alertManager = new AlertManager(this.db, this.messageManager);
		this.invasionManager = new InvasionManager(this.db, this.messageManager);
	}
	
	async checkEvents() {
		const text = (await request.get("http://content.warframe.com/dynamic/rss.php")).text;
			   
		parseString(text, (err, result) => {
			// console.log(result.rss.channel[0].item);
			// item is an array of objects
			// objects look like this
			/*
				{ guid: [ '59fe5ed114c4f2eb2408a0b2' ],
				title: [ '12200cr - Naeglar (Eris) - 43m' ],
				author: [ 'Alert' ],
				description: [ 'Enemy Shock Troops Located' ],
				pubDate: [ 'Sun, 05 Nov 2017 00:48:02 +0000' ],
				'wf:faction': [ 'FC_INFESTATION' ],
				'wf:expiry': [ 'Sun, 05 Nov 2017 01:31:10 +0000' ] } 
			*/

			for (const wfEvent of result.rss.channel[0].item) {
				const guid = wfEvent.guid[0];
				const platform = "0"; // pc = 0, xb1 = 1, ps4 = 2
				const author = wfEvent.author[0] === "Alert" ? 0 : wfEvent.author[0] === "Invasion" ? 1 : 2;
				const title = wfEvent.title[0].split(" - ");
				let description, date, loc, rewards;
				// title gives rewards and location
				// if its an alert
				if (author === 0) {
					description = wfEvent.description[0];
					date = new Date(wfEvent["wf:expiry"][0]).getTime() / 1000 >> 0;
					loc = title[title.length - 2];
					rewards = title.slice(0, -2).join("\n+ ");
				} 
				// invasion or outbreak
				else {
					const rewardRegex = /\((.*?)\)/g;
					loc = title[title.length - 1];
					// outbreak
					if (author === 2) {
						rewards = title[0];
					} else {
						rewards = [];
						let match;
						while ((match = rewardRegex.exec(title.slice(0, -1))) != null) {
							rewards.push(match[1]);
						}
						rewards = rewards.join("\n+ ");
					}
				}
				if (author === 0) {
					this.alertManager.addAlert(guid, platform, author, rewards, loc, date, description);
				} else {
					this.invasionManager.addInvasion(guid, platform, author, rewards, loc);
				}
				// handling database
				// insert current things into database
				// yells on dupes but empty catch does it :^)
				/*
				this.db.query("insert into events (guid, platform, author, \
					rewards, location, expirDate, description) values ($1, \
					$2, $3, $4, $5, to_timestamp($6), $7)",
					[guid, platform, author, rewards, loc, date, description])
					.then(res => {
						// send update message to all channels
					})
					.catch();
				*/
				// remove old events 
				// doesnt seem to affect nulls so thats fine
				
			}
		})
	}

	broadcastUpdates(eventGUIDs) {

	}
}

module.exports = EventManager;
