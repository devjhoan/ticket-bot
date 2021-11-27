const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const TicketSchema = require('../../models/ticketSchema');

module.exports = {
    name: "set-channels",
    description: "Configure the channels",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "logs",
            description: "Set the channel for the logs",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"]
        },
        {
            name: "transcript",
            description: "Set the channel for the transcripts",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"]
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

        const guildData = await TicketSchema.findOne({ guildID: interaction.guild.id});
        let logChannel = interaction.options.getChannel('logs');
        let transcriptChannel = interaction.options.getChannel('transcript');

        if(logChannel) {
            if(guildData) {
                if(guildData.channelLog == logChannel.id) {
                    return interaction.reply({content: `${mensajes['CHANNEL-EXISTS']}`, ephemeral: true})
                } else {
                    guildData.channelLog = logChannel.id;
                }
                await guildData.save()
                return interaction.reply({
                    embeds : [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("Ticket System | Channel logs")
                            .setDescription(`The Log channel has been set to ${logChannel} with the id ${logChannel.id}`)
                    ]
                })
            } else {
                await TicketSchema.create({
                    guildID: interaction.guild.id,
                    roles: {
                        staffRole: '',
                        adminRole: '',
                    },
                    tickets: [],
                    channelLog: channel.id,
                    channelTranscript: ''
                })
                return interaction.reply({
                    embeds : [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("Ticket System | Channel logs")
                            .setDescription(`The Log channel has been set to ${logChannel} with the id ${logChannel.id}`)
                    ]
                })                        
            }
        }
        if(transcriptChannel) {
            if(guildData) {
                if(guildData.channelTranscript == transcriptChannel.id) {
                    return interaction.reply({content: `${mensajes['CHANNEL-EXISTS']}`, ephemeral: true})
                } else {
                    guildData.channelTranscript = transcriptChannel.id;
                }
                await guildData.save()
                return interaction.reply({
                    embeds : [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("Ticket System | Channel transcripts")
                            .setDescription(`The Transcript channel has been set to ${transcriptChannel} with the id ${transcriptChannel.id}`)
                    ]
                })
            } else {
                await TicketSchema.create({
                    guildID: interaction.guild.id,
                    roles: {
                        staffRole: '',
                        adminRole: '',
                    },
                    tickets: [],
                    channelLog: '',
                    channelTranscript: channel.id
                })
                return interaction.reply({
                    embeds : [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("Ticket System | Channel transcripts")
                            .setDescription(`The Transcript channel has been set to ${transcriptChannel} with the id ${transcriptChannel.id}`)
                    ]
                })                        
            }
        }
    }
}