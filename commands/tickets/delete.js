const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "delete",
  aliases: ["borrar"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.DELETE === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
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
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
  },
};