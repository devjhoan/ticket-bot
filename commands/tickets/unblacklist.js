const { Client, Message, MessageEmbed } = require('discord.js');
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require('../../models/ticketSchema')

module.exports = {
  name: "unblacklist",
  aliases: ["unbl"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.UNBLACKLIST === false) return;
    
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!message.member.roles.cache.get(guildData.roles.adminRole)) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    if(!guildData) {
      return message.channel.send({content: `${mensajes["NO-SERVER-FIND"]}`})
  }
    let usuario = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!usuario) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("You must mention the person you want unblacklist!\nUsague: `unblacklist <mention/id>`").setColor("RED")]})
    }

    const blacklistData = guildData.usersBlacklisted;
    const findBlacklisted = blacklistData.find(user => user.userID === usuario.id);
    if(!findBlacklisted) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("This user is not blacklisted").setColor("RED")]})
    }
    let filteredBlacklisted = blacklistData.filter(user => user.userID !== usuario.id);
    guildData.usersBlacklisted = filteredBlacklisted;
    await guildData.save();
    
    let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Ticket System | User Unblacklisted`)
            .setDescription(`The user has been successfully unblacklisted*`);
    return message.channel.send({embeds: [embed]})
  },
};