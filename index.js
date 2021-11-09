const { Client, Collection, Message } = require("discord.js");

const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config/config.json');

// Initializing the project
require("./handler")(client);

client.login(client.config.TOKEN);