const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

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
          id: guildData.roles.staffRole,
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
if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
let logcanal = guildData.channelLog;
if(!logcanal) return;
  if(config.TICKET["LOGS-SYSTEM"] == true) {
    client.channels.cache.get(logcanal).send(
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