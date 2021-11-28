const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
  name: "close",
  aliases: ["ticket-close"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.CLOSE === false) return;
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!guildData.roles || !guildData.roles.staffRole) return message.channel.send({content: mensajes["NO-ROLES-CONFIG"]}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    if(!message.member.roles.cache.get(guildData.roles.staffRole) && !message.member.roles.cache.get(guildData.roles.adminRole)) return message.reply({content: `${mensajes['NO-PERMS']}`}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));

    if(!guildData) return message.channel.send({content: mensajes['NO-SERVER-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete() }, 5000));
    if(!guildData.tickets || guildData.tickets.length === 0) return message.channel.send({content: mensajes['NO-TICKET-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(message.channel.parentId)) return message.channel.send({content: mensajes['NO-TICKET']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    
    const idmiembro = message.channel.topic;
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
    const log = new MessageEmbed()
        .setDescription(`${mensajes['CLOSE-A-TICKET']}`.replace('<user.tag>', message.author.tag).replace('<user.mention>', message.author).replace('<user.id>', message.author.id).replace('<user.username>', message.author.username).replace('<user.discriminator>', message.author.discriminator))
        .setColor("ORANGE")
    message.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: false });
    message.channel.send({
        embeds: [log]
    })
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
  },
};