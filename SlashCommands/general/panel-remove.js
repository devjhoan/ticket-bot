const { Client, CommandInteraction, MessageEmbed, GuildApplicationCommandManager } = require("discord.js");
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "panel-remove",
    description: "Remove a ticket panel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "id",
            description: "Use the id of your panel",
            type: "STRING",
            required: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let ide = interaction.options.getString("id");

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }
        
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) {
            return interaction.reply({content: `${mensajes["NO-SERVER-FIND"]}`, ephemeral: true})
        }

        const guildTicket = guildData.tickets
        const findTicket = guildTicket.find(x => x.customID == ide)
        if(!findTicket) {
            return interaction.reply({content: `${mensajes["NO-TICKET-FIND"]}`, ephemeral: true})
        }

        const filteredTickets = guildTicket.filter(x => x.customID != ide)
        guildData.tickets = filteredTickets;

        await guildData.save().catch(err => console.log(err))

        let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Ticket System | Panel Removed`)
            .setDescription(`The panel has been successfully **removed**`);
        return interaction.reply({embeds: [embed]})
    },
};