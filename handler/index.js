const { glob } = require("glob");
const { promisify } = require("util");
const mongoose = require("mongoose");
const { success, error } = require("../controllers/logger");

const globPromise = promisify(glob);

/**
 * @param {import("..").Bot} client
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
        if (client.config["GUILD-ID"] === "SERVER_ID") {
            error("Please set the GUILD-ID in the config.json file");
            process.exit(1);
        }
        const guild = client.guilds.cache.get(client.config["GUILD-ID"]);
        try { await guild.commands.set(arrayOfSlashCommands) } 
        catch (error_) {
            error(error_);
            process.exit(1);
        }
        success(`Successfully loaded ${arrayOfSlashCommands.length} slash commands`);
        success(client.languages.__("system.bot_ready"));
    });

    // mongoose
    const { MONGO_URI } = client.config;
    if (!MONGO_URI || MONGO_URI === "MONGO-CONNECTION-STRING-HERE") {
        return error(client.languages.__("errors.bad_mongo_uri"));
    }

    mongoose.connect(MONGO_URI).then(() => {
        success(client.languages.__("system.mongo_connected"));
    });
};
