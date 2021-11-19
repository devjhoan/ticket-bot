const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "channel-log",
    description: "set the channel for logs",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "channel",
            description: "set the channel for logs system",
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

        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        if(guildData) {
            if(guildData.channelLog == channel.id) {
                return interaction.reply({content: `${mensajes['CHANNEL-EXISTS']}`, ephemeral: true})
            } else {
                guildData.channelLog = channel.id;
            }
            await guildData.save().catch(err => console.log(err));
        } else {
            await ticketSchema.create({
                guildID: interaction.guild.id,
                channelLog: channel.id
            }).catch(err => console.log(err));
        }

        interaction.reply({
            embeds : [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Log Channel Set")
                    .setDescription(`The Log channel has been set to ${channel} with the id ${channel.id}`)
            ]
        })
    },
};