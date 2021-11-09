const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "channel-transcript",
    description: "set the channel for transcripts",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "channel",
            description: "set the channel for transcript system",
            type: "CHANNEL",
            // only allow text channels
            channelTypes: ["GUILD_TEXT"],
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        let channel = interaction.options.getChannel('channel');
        // set the channel id
        let channelID = channel.id;
        // save in the config file the channel id in a array called LOG-CHANNEL
        config.TICKET['TRANSCRIPT-CHANNEL'] = channelID;
        // save the config file
        require('fs').writeFile('./config/config.json', JSON.stringify(config, null, 4), (err) => {
            if (err) console.log(err);
        });
        // send a message to the channel with the channel name and the channel id in a embed message with a color green 
        interaction.reply({
            embeds : [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Transcript Channel Set")
                    .setDescription(`The Transcript channel has been set to ${channel} with the id ${channelID}`)
            ]
        })
    },
};