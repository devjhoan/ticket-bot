const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
  name: "add",
  aliases: ["ticket-add"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.ADD === false) return;
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})

    if(!guildData.roles || !guildData.roles.staffRole) return message.channel.send({content: mensajes["NO-ROLES-CONFIG"]}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    if(!message.member.roles.cache.get(guildData.roles.staffRole) && !message.member.roles.cache.get(guildData.roles.adminRole)) return message.reply({content: `${mensajes['NO-PERMS']}`}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    
    if(!guildData) return message.reply({content: mensajes['NO-SERVER-FIND']}).then((msg) =>
    setTimeout(() => {message.delete(), msg.delete()}, 5000));
    if(!guildData.tickets || guildData.tickets.length === 0) return message.channel.send({content: mensajes['NO-TICKET-FIND']}).then((msg) =>
    setTimeout(() => {message.delete(), msg.delete()}, 5000));
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(message.channel.parentId)) return message.channel.send({content: mensajes['NO-TICKET']}).then((msg) =>
    setTimeout(() => {message.delete(), msg.delete()}, 5000));

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    const embed2 = new MessageEmbed()
      .setDescription("```"+ mensajes['NO-TICKET-ADD'] +"```")
      .setColor("RED")
    if(!user) return message.channel.send({embeds: [embed2]}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    let añadido = user.id;
    message.channel.permissionOverwrites.edit(añadido, {
        ATTACH_FILES: true,
		    READ_MESSAGE_HISTORY: true,
		    SEND_MESSAGES: true,
		    VIEW_CHANNEL: true
    })
    const embed = new MessageEmbed()
    .setTitle("Support System ✅")
    .setDescription(`> Staff:\n <@!${message.author.id}>\n> Miembro Añadido:\n<@!${(await client.users.fetch(añadido)).id}>`)
    .setColor("DARK_GREEN")
    .setTimestamp()
    message.channel.send({
        embeds: [embed]
    })
    if(!guildData) return message.reply({content: `${mensajes['NO-SERVER-FIND']}`}).then((msg) => setTimeout(() => {msg.delete()}, 5000));
    let logcanal = guildData.channelLog;
    if(!logcanal) return;
    if(config.TICKET["LOGS-SYSTEM"] == true) {
      client.channels.cache.get(logcanal).send(
        {embeds: [new MessageEmbed()
            .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Add Member", "https://emoji.gg/assets/emoji/9846-discord-stage.png")
            .setColor("GREEN")
            .setDescription(`
            **User**: <@!${message.member.user.id}>
            **Action**: Add a member
            **Member Add**: <@!${user.id}>
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