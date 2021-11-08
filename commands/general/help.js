const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');


module.exports = {
  name: "help",
  aliases: ["ayuda"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const perms = message.member.roles.cache.has(config.TICKET['ADMIN-ROLE']);
    if(!perms) {
        return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription(mensajes['NO-PERMS'])]})
    }
    let asd = args[0]
    if(!asd) {
      const embed = new MessageEmbed()
        .setTitle(""+config.TICKET["SERVER-NAME"]+" | Ticket System")
        .setDescription("```add, alert, blacklist, claim, close, delete, remove, rename, stats, unblacklist```")
        .setColor("#2f3136")
        .setFooter(`Request by: ${message.author.tag}`)
      return message.channel.send({embeds: [embed]});
    }
    let comando = args[0]
    if(comando == "add") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("add <id/mention>").setColor("#2f3136")]})
    }
    if(comando == "alert") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("alert <id/mention>").setColor("#2f3136")]})
    }
    if(comando == "blacklist") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("blacklist <id/mention> [reason]").setColor("#2f3136")]})
    }
    if(comando == "claim") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("only claim :D").setColor("#2f3136")]})
    }
    if(comando == "close") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("only close :D").setColor("#2f3136")]})
    }
    if(comando == "delete") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("only delete :D").setColor("#2f3136")]})
    }
    if(comando == "remove") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("remove <id/mention>").setColor("#2f3136")]})
    }
    if(comando == "stats") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("only stats :D").setColor("#2f3136")]})
    }
    if(comando == "unblacklist") {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("unblacklist <id/mention>").setColor("#2f3136")]})
    }
  },
};