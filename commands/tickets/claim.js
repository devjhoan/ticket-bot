const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "claim",
  aliases: ["ticket-claim"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.CLAIM === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {
        msg.delete()
    }, 5000)
);
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
    const idmiembro = message.channel.topic;
    message.channel.permissionOverwrites.set([
      {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
      },
      {
          id: idmiembro,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
      },
      {
          id: message.author.id,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
      },
      {
          id: config.TICKET['STAFF-ROLE'],
          deny: ['VIEW_CHANNEL'],
      }
  ]);
  const embed = new MessageEmbed()
    .setDescription("```"+ mensajes['TICKET-CLAIMED'] +" "+ message.author.tag +"```")
    .setColor("GREEN")
  message.channel.send({
    embeds: [embed]
  }).then((msg) => {
    msg.react("👋")
  })
  if(config.TICKET["LOGS-SYSTEM"] == true) {
    client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
      {embeds: [new MessageEmbed()
          .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Claimed", "https://emoji.gg/assets/emoji/6290-discord-invite-user.png")
          .setColor("YELLOW")
          .setDescription(`
          **User**: <@!${message.member.user.id}>
          **Action**: Claimed a ticket
          **Ticket Name**: ${message.channel.name}`)
          .setFooter("Ticket System by: Jhoan#6969")]}
  )
  }
  if(config.TICKET["LOGS-SYSTEM"] == false) {
  return;
  }
  },
};