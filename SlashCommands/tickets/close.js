const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
if(enable.COMMANDS.CLOSE === false) return;

module.exports = {
    name: "close",
    description: "close the ticket of a user",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
    if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.followUp({content: mensajes['NO-PERMS'], ephemeral: true})
    if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.followUp({content: mensajes['NO-TICKET']})
    const idmiembro = interaction.channel.topic;
    const embed = new MessageEmbed()
        .setDescription("```Support team ticket controls```")
        .setColor("#2f3136")
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel("Transcript")
            .setStyle("SECONDARY")
            .setEmoji("📑")
            .setCustomId("Ticket-Transcript"),
        new MessageButton()
            .setLabel("Open")
            .setStyle("SECONDARY")
            .setEmoji("🔓")
            .setCustomId("Ticket-Open"),
        new MessageButton()
            .setLabel("Delete")
            .setStyle("SECONDARY")
            .setEmoji("⛔")
            .setCustomId("Ticket-Delete")
    )
    interaction.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: false });
    interaction.followUp({
        embeds: [embed],
        components: [row]
    })
    },
};