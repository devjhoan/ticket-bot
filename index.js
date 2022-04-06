const { Client, Collection } = require("discord.js");

class Bot extends Client {
    constructor() {
        super({
            intents: 32767
        });

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.config = require('./config/config.json');
    }
};

const client = new Bot();
module.exports = client;

// Initializing the project
require("./handler")(client);

client.login(client.config.TOKEN);