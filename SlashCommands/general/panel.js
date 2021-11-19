const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "panel",
    description: "Create the panel whit buttons",
    type: 'CHAT_INPUT',
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
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
        if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
        const options = guildData.tickets.map(x => {
            return {
                label: x.ticketName,
                value: x.customID,
                description: x.ticketDescription || "Support Ticket",
                emoji: x.ticketEmoji,
            }
        })
        const panelEmbed = new MessageEmbed()
            .setAuthor(`${config.TICKET["SERVER-NAME"]}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
            .setDescription(`${mensajes["MESSAGE-EMBED"]}`)
            .setColor("#2f3136")
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("SUPPORT-SYSTEM")
                .setMaxValues(1)
                .addOptions(options)
        )        
        interaction.reply({embeds: [panelEmbed], components: [row]})
    },
};