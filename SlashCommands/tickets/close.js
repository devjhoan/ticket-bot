const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

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
    if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.reply({content: `You don't have permissions!`, ephemeral: true})
    
    const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
    if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
    if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})

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
    interaction.reply({
        embeds: [embed],
        components: [row]
    })
    },
};