const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

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
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
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
    message.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: false });
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
  },
};