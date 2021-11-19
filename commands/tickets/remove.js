const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
  name: "remove",
  aliases: ["ticket-remove"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.REMOVE === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!guildData) return message.channel.send({content: mensajes['NO-SERVER-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete() }, 5000));
    if(!guildData.tickets || guildData.tickets.length === 0) return message.channel.send({content: mensajes['NO-TICKET-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(message.channel.parentId)) return message.channel.send({content: mensajes['NO-TICKET']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));

    let si = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!si) return message.channel.send({content: "Hey, you haven't specified the user you want to remove"}).then((msg) =>
    setTimeout(() => {msg.delete() }, 5000));
    let removido = si.id;
    const embed2 = new MessageEmbed()
      .setDescription("```"+ mensajes['NO-TICKET-REMOVE'] +"```")
      .setColor("RED")
    if(!si) return message.channel.send({embeds: [embed2]})
    message.channel.permissionOverwrites.edit(removido, {
      VIEW_CHANNEL: false
    })
    const embed = new MessageEmbed()
    .setTitle("Support System :x:")
    .setDescription(`> Staff:\n <@!${message.author.id}>\n> ${mensajes['TICEKT-REMOVED']}:\n<@!${(await client.users.fetch(removido)).id}>`)
    .setColor("DARK_RED")
    .setTimestamp()
    message.channel.send({
        embeds: [embed]
    })
  if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
  let logcanal = guildData.channelLog;
  if(!logcanal) return;
    if(config.TICKET["LOGS-SYSTEM"] == true) {
      client.channels.cache.get(logcanal).send(
        {embeds: [new MessageEmbed()
            .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Remove Member", "https://emoji.gg/assets/emoji/1590_removed.png")
            .setColor("RED")
            .setDescription(`
            **User**: <@!${message.member.user.id}>
            **Action**: Remove a Member
            **Member Removed**: <@!${removido}>
            **Ticket Name**: ${message.channel.name}
            **Ticket Owner**: <@!${message.channel.topic}>`)
            .setFooter("Ticket System by: Jhoan#6969")]}
    )
    }
    if(config.TICKET["LOGS-SYSTEM"] == false) {
    return;
    }
},
};