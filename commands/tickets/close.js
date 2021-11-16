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
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {
        msg.delete()
    }, 5000)
);
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
    const embed2 = new MessageEmbed()
        .setDescription(`${mensajes['CLOSE-A-TICKET']}`.replace('<user.tag>', message.author.tag).replace('<user.mention>', message.author).replace('<user.id>', message.author.id).replace('<user.username>', message.author.username).replace('<user.discriminator>', message.author.discriminator))
        .setColor("ORANGE")
    message.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: false });
    message.channel.send({
        embeds: [embed2]
    })
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
  },
};