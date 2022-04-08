const { warn, error, debug } = require("./controllers/logger");
const { Client, Collection } = require("discord.js");
const { version } = require('./package.json');
const { readdirSync } = require("fs");
const { join } = require("path");

if (process.version.slice(1).split(".")[0] < 16) {
    error(`Please update to Node 16 or higher.`);
    process.exit(1);
}

/**
 * The Discord client instance
 * @typedef {Bot} Bot
 * @extends {Client}
 */
class Bot extends Client {
    constructor() {
        super({
            intents: 32767
        });

        const locales = [];
        readdirSync(join(__dirname, 'locales'))
            .filter(file => file.endsWith('.json'))
            .forEach((file) => {
                locales.push(file.replace('.json', ''))
            });

        this.commands = new Collection();
        debug(`Successfully loaded ${locales.length} locales`);
        this.slashCommands = new Collection();
        this.config = require('./config/config.json');
        debug(`Successfully loaded config`);
        this.languages = require('i18n');
        debug(`Successfully loaded languages`);
        
        this.languages.configure({
            locales: locales,
            directory: join(__dirname, 'locales'),
            defaultLocale: 'en',
            retryInDefaultLocale: true,
            objectNotation: true,
            register: global,

            logWarnFn: function(msg) {
                warn(msg);
            },

            logErrorFn: function(msg) {
                error(msg);
            },

            missingKeyFn: function(locale, key) {
                return key;
            },

            mustacheConfig: {
                tags: ["{{", "}}"],
                disable: false
            }
        });
        this.languages.setLocale(this.config.LANGUAGE);
        debug(`Successfully set language to ${this.config.LANGUAGE}`);
        this.version = version;
    }
};

const client = new Bot();
module.exports = client;

// Initializing the project
require("./handler")(client);

client.login(client.config.TOKEN);