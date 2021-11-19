const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

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
        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }
        let channel = interaction.options.getChannel('channel');

        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        if(guildData) {
            if(guildData.channelTranscript == channel.id) {
                return interaction.reply({content: `${mensajes['CHANNEL-EXISTS']}`, ephemeral: true})
            } else {
                guildData.channelTranscript = channel.id;
            }
            await guildData.save()
        } else {
            await ticketSchema.create({
                guildID: interaction.guild.id,
                channelTranscript: channel.id
            })
        }

        // send a message to the channel with the channel name and the channel id in a embed message with a color green 
        interaction.reply({
            embeds : [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Transcript Channel Set")
                    .setDescription(`The Transcript channel has been set to ${channel} with the id ${channel.id}`)
            ]
        })
    },
};