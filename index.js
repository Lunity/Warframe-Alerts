const WebSocket = require("./socket/WebSocketConnection");
const settings = require("./settings.json");
const conn = new WebSocket(settings.token);

conn.on("message", message => {
    console.log(message);
})

conn.on("close", data => {
    console.error("socket closed");
    console.error(data);
})
