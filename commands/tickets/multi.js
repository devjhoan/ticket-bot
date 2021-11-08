const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "multi",
  aliases: ["multipanel"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.MULTI === false) return;
    if(!message.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    const canal = message.mentions.channels.first() || message.channel;
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(config['TICKET-PANEL']['CUSTOM-ID'])
            .setEmoji(config['TICKET-PANEL']['BUTTON-EMOJI'])
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId(config['TICKET-PANEL-2']['CUSTOM-ID'])
            .setEmoji(config['TICKET-PANEL-2']['BUTTON-EMOJI'])
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId(config['TICKET-PANEL-3']['CUSTOM-ID'])
            .setEmoji(config['TICKET-PANEL-3']['BUTTON-EMOJI'])
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId(config['TICKET-PANEL-4']['CUSTOM-ID'])
            .setEmoji(config['TICKET-PANEL-4']['BUTTON-EMOJI'])
            .setStyle("SECONDARY"),
    )
    const embed = new MessageEmbed()
        .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket System", "https://emoji.gg/assets/emoji/7607-cyansmalldot.png")
        .setColor("#2f3136")
        .setDescription("Para crear un ticket use el botón correspondiente a cada categoría\n De lo contrario será sancionado!\n\n<:iron:875531614686416917> **General Support**\n<:gold:875531713307111464> **Buycraft Support**\n<:diamond:875531633514655805> **Ban Appeal Support**\n<:emerald:902460007285653516> **Claim Rank Support**")
    client.channels.cache.get(canal.id).send({embeds: [embed], components : [row]})
  },
};