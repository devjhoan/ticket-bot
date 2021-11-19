const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "panel-list",
    description: "List the panels created",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})

        const ticketList = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!ticketList) {
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System`)
                .setDescription(`No panels created`)
                .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`);
            return interaction.reply({embeds: [embed]})
        }
        if(!ticketList || !ticketList.tickets || ticketList.tickets.length === 0) {
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System`)
                .setDescription(`No panels created`)
                .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`);
            return interaction.reply({embeds: [embed]})
        }
        const data = [];

        const options = ticketList.tickets.map(x => {
            return {
                customID: x.customID,
                ticketName: x.ticketName,
                ticketDescription: x.ticketDescription,
                ticketCategory: x.ticketCategory,
                ticketEmoji: x.ticketEmoji
                }
            })
        for(let i = 0; i < options.length; i++) {
            data.push(`**ID:** ${options[i].customID}`)
            data.push(`**Name:** ${options[i].ticketName}`)
            data.push(`**Description:** ${options[i].ticketDescription || "No specified!"}`)
            data.push(`**Category:** ${options[i].ticketCategory || "No specified!"}`)
            data.push(`**Emoji:** ${options[i].ticketEmoji || "No specified!"}\n`)
        }
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${config.TICKET["SERVER-NAME"]}'s panels`)
            .setDescription(data.join("\n"))
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({embeds: [embed]})
    },
};