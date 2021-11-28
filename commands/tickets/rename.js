const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

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
    let name = args[0];
    if(!name) return message.channel.send({content: 'Hey, you have not indicated the name of the channel'}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
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
    if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
    let logcanal = guildData.channelLog;
    if(!logcanal) return;
    if(config.TICKET["LOGS-SYSTEM"] == true) {
      client.channels.cache.get(logcanal).send(
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