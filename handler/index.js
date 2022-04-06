const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const config = require('../config/config.json')

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/commands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        const guild = client.guilds.cache.get(config["GUILD-ID"]);
        guild.commands.set(arrayOfSlashCommands);
    });

    // mongoose
    const { MONGO_URI } = require('../config/config.json')
    if (!MONGO_URI) return console.error("MONGO_URI is not defined in config.json");
    if (MONGO_URI === "MONGO-CONNECTION-STRING-HERE") return console.error("MONGO_URI is not defined in config.json");

    mongoose.connect(MONGO_URI).then(() => console.log('Connected to mongodb'));
};
