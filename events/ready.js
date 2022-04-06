const { success } = require('../controllers/logger');
const client = require('../index');

client.on("ready", (client_) =>  {
    success(client_.languages.__("system.bot_ready"));
});