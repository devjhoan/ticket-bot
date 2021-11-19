const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "panel-edit",
    description: "Edit a ticket panel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'custom-id',
            description: 'Custom id, of the panel to edit',
            type: 'STRING',
            required: true
        },
        {
            name: 'ticket-name',
            description: 'Name of the ticket',
            type: 'STRING',
            required: false
        },
        {
            name: 'ticket-description',
            description: 'Description of the ticket',
            type: 'STRING',
            required: false
        },
        {
            name: 'ticket-category',
            description: 'Category of the ticket',
            type: 'CHANNEL',
            channelTypes: ["GUILD_CATEGORY"],
            required: false
        },
        {
            name: 'ticket-emoji',
            description: 'Emoji of the ticket',
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

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }

        let customID = interaction.options.getString("custom-id");
        let ticketName = interaction.options.getString("ticket-name");
        let ticketDescription = interaction.options.getString("ticket-description");
        let ticketCategory = interaction.options.getChannel("ticket-category");
        let ticketEmoji = interaction.options.getString("ticket-emoji");

        const guildData = await ticketSchema.findOne({ guildID: interaction.guild.id });
        if (!guildData) {
            return interaction.reply({
                content: `${mensajes["NO-SERVER-FIND"]}`,
                ephemeral: true
            });
        }
        if(!guildData.tickets || guildData.tickets.length == 0) {
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System`)
                .setDescription(`No panels created`)
                .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`);
            return interaction.reply({embeds: [embed], ephemeral: true},)
        }
        let ticketData = guildData.tickets.find(x => x.customID === customID);
        if (!ticketData) {
            return interaction.reply({
                content: `${mensajes["NO-TICKET-FIND"]}`,
                ephemeral: true
            });
        } else  {
            if(ticketName) {
                ticketData.ticketName = ticketName;
            }
            if(ticketDescription) {
                ticketData.ticketDescription = ticketDescription;
            }
            if(ticketCategory) {
                ticketData.ticketCategory = ticketCategory.id;
            }
            if(ticketEmoji) {
                ticketData.ticketEmoji = ticketEmoji;
            }
            await ticketSchema.updateOne({ guildID: interaction.guild.id }, { $set: { tickets: guildData.tickets } });
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System | Panel Edited`)
                .setDescription(`**ID:** ${ticketData.customID}\n**Name:** ${ticketData.ticketName}\n**Description:** ${ticketData.ticketDescription}\n**Category:** ${ticketData.ticketCategory}\n**Emoji:** ${ticketData.ticketEmoji}`)
                .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`);
            return interaction.reply({embeds: [embed], ephemeral: true},)
        }
    },
};