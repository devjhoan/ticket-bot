const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const glob = require("glob");
module.exports = {
    name: "reload",
    description: "Reloads a command",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'command',
            description: 'The command to reload',
            type: 'STRING',
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        // Check if the user has the permission to use this command
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: "You don't have the permission to use this command!", ephemeral: true});
        }
        // make a array with all the commands names of the bot
        const commands = client.commands.map(command => command.name);
        const kommand = interaction.options.getString("command");

        if(kommand) {
            // if the command is not in the array return
            if (!commands.includes(kommand)) {
                return interaction.reply({content: "The command you are trying to reload is not in the bot!", ephemeral: true});
            } else {
                client.commands.sweep(() => true);
                glob(`${__dirname}/../../commands/**/${kommand}.js`, async (err, filePath) => {
                    if(err) return console.error(err);
                    filePath.forEach((file) => {
                        delete require.cache[require.resolve(file)];

                        const pull = require(file);

                        if (pull.name) {
                            client.commands.set(pull.name, pull);
                        }
                        if(pull.aliases && Array.isArray(pull.aliases)) {
                            pull.aliases.forEach((alias) => {
                                client.commands.set(alias, pull);
                            });
                        }
                    })
                });
                return interaction.reply({content: "The command `"+ kommand +"` has been reloaded!", ephemeral: true});
            }
        } else {
            client.commands.sweep(() => true);
            glob(`${__dirname}/../../commands/**/*.js`, async (err, filePath) => {
                if(err) return console.error(err);
                filePath.forEach((file) => {
                    delete require.cache[require.resolve(file)];

                    const pull = require(file);

                    if (pull.name) {
                        client.commands.set(pull.name, pull);
                    }
                    if(pull.aliases && Array.isArray(pull.aliases)) {
                        pull.aliases.forEach((alias) => {
                            client.commands.set(alias, pull);
                        });
                    }
                })
            });
            return interaction.reply({content: "Reloading all commands...", ephemeral: true});
        }
    },
};