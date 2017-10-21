module.exports = (bot, config, event) => {
  console.log(`Disconnected with ${event.code}`);
  if (event.code === 1000) process.exit();
}
