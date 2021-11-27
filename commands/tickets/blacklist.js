const { Client, Message, MessageEmbed } = require('discord.js');
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require('../../models/ticketSchema')

module.exports = {
  name: "blacklist",
  aliases: ["bl"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.BLACKLIST === false) return;

    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!message.member.roles.cache.get(guildData.roles.adminRole)) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));

    let usuario = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!usuario) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription(""+mensajes['MENTION-BLACKLIST']+"").setColor("RED")]})
    }
    let razon = args.slice(1).join(" ") || "No reason!";

    let schema = {
        userID: usuario.id,
        reason: razon,
        moderator: message.author.id,
        date: new Date(),
    }

    if(guildData) {
      let blacklistData = guildData.usersBlacklisted.find((x) => x.userID === usuario.id)
      if(blacklistData) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription(mensajes['USER-ALR-BLACKLISTED']).setColor("RED")]})
      } else {
        guildData.usersBlacklisted =  [...guildData.usersBlacklisted, schema]
        guildData.save()
        return message.channel.send({embeds: [new MessageEmbed().setDescription(mensajes['USER-BLACKLISTED']).setColor("GREEN")]})
      }
    } else {
      let newGuildData = new ticketSchema({
        guildID: message.guild.id,
        usersBlacklisted: [schema]
      })
      newGuildData.save()
      return message.channel.send({embeds: [new MessageEmbed().setDescription(mensajes['USER-BLACKLISTED']).setColor("GREEN")]})
    }
  },
};