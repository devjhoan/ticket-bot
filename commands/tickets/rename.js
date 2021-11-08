const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "rename",
  aliases: ["ticket-rename"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.RENAME === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
    let newName = args[0].replace("ticket-", "");
    let channel = message.channel;
    if(!newName) {
        const embed2 = new MessageEmbed()
          .setDescription("```" +mensajes['NO-TICKET-RENAME']+ "```")
          .setColor("RED")
        return message.channel.send({embeds: [embed2]})
    }
    channel.edit({name: `ticket-${newName}`}, "Ticket Rename")
    const renameado = new MessageEmbed()
    .setDescription("```"+ mensajes['TICKET-RENAMED'] +" ticket-"+ newName +"```")
    .setColor("GREEN")
    message.channel.send({embeds:[renameado]})
    if(config.TICKET["LOGS-SYSTEM"] == true) {
      client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
        {embeds: [new MessageEmbed()
            .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Rename Ticket", "https://emoji.gg/assets/emoji/9557-pencil.png")
            .setColor("DARK_VIVID_PINK")
            .setDescription(`
            **User**: <@!${message.member.user.id}>
            **Action**: Rename a ticket!
            **Ticket Old Name**: ${channel.name}
            **Ticket New Name**: ticket-${newName}
            **Ticket Owner**: <@!${message.channel.topic}>`)
            .setFooter("Ticket System by: Jhoan#6969")]}
    )
    }
    if(config.TICKET["LOGS-SYSTEM"] == false) {
    return;
    }
  },
};