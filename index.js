const WebSocket = require("./socket/WebSocketConnection");
const conn;

try {
    const settings = require("./settings.json");
    conn = new WebSocket(settings.token);
} catch (e) {
    conn = new WebSocket(process.env.DISCORD_TOKEN)
}

conn.on("message", message => {
    console.log(message);
})

conn.on("close", data => {
    console.error("socket closed");
    console.error(data);
})
