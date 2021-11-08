const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

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
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.followUp({content: mensajes['NO-PERMS']})
        if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.followUp({content: mensajes['NO-TICKET']})
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
        interaction.followUp({
            embeds: [embed],
            components: [row]
        })
    },
};