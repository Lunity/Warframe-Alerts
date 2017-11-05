const WebSocket = require("ws");
const request = require("snekfetch");
const EventEmitter = require("events");

class WebSocketConnection extends EventEmitter {

    constructor(token, version = 6, encoding = "json") {
        super();
        this.token = token;
        this._initialize(version, encoding);
    }

    async _initialize(version, encoding) {
        try {
            const url = (await request.get("https://discordapp.com/api/gateway")).body.url;
            this.socket = new WebSocket(url + `/?v=${version}&encoding=${encoding}`);
            // // //
            this.socket.on("open", () => {});
            this.socket.once("message", this._heartbeathandle.bind(this));
            this.socket.on("close", this._closehandle.bind(this));
        } catch (e) {
            console.error("Error initializing websocket: " + e);
        }
    }

    // set up heart beat info
    _heartbeathandle(data) {
        data = JSON.parse(data);
        if (data.op !== 10) {
            throw new Error("Expected heartbeat info packet but instead got op " + data.op);
        }
        
        this.acked = true;
        this.hbinterval = data.d.heartbeat_interval;
        this.hb = setTimeout(this._hbtimeout.bind(this), this.hbinterval);
        this._identifymyself();
    }
    
    _hbtimeout() {
        if (!this.acked) {
            throw new Error("Did not recieve acknowledgement of heartbeat between them.");
            // try to resume
        }
        this.acked = false;
        this.socket.send(JSON.stringify({
            "op": 1,
            "d": this.lastS
        }))
        this.hb = setTimeout(this._hbtimeout.bind(this). this.hbinterval);
    }

    _identifymyself() {
        this.socket.send(JSON.stringify({
            "op": 2,
            "d": {
                "token": this.token,
                "properties": {},
                "compress": false,
                "large_threshold": 50
            }
        }))
        this.socket.on("message", this._messagehandle.bind(this));
    }

    _closehandle(data) {
        clearTimeout(this.hb);
        this.socket.removeAllListeners();
        this.emit("close", data);
    }

    _messagehandle(data) {
        data = JSON.parse(data);
        if (data.op === 11) {
            this.acked = true;
        } else if (data.op === 0) {
            this.lastS = data.s;
            if (data.t === "MESSAGE_CREATE") {
                this.emit("message", data.d);
            }
        }
    }

}

module.exports = WebSocketConnection;
