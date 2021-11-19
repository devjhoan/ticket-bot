const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
module.exports = {
    name: "delete",
    description: "delete a ticket",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(enable.COMMANDS.DELETE === false) return;
        
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
        if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
        if(!interaction.member.roles.cache.get(guildData.roles.staffRole) && !interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Delete Ticket")
                .setStyle("DANGER")
                .setCustomId("DELETE-TICKET-N"),
            new MessageButton()
                .setLabel("Cancel")
                .setStyle("SECONDARY")
                .setCustomId("CANCEL-TICKET-N"),
        )
        const embed = new MessageEmbed()
            .setDescription("```Para cerrar el ticket confirme!```")
            .setColor("DARK_RED")
        interaction.reply({
            embeds: [embed],
            components: [row]
        })
    },
};