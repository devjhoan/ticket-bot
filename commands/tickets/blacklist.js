const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');

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
    if(!message.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    let usuario = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!usuario) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("Debes mencionar la persona que deseas blacklistear!\nUso: `blacklist <mention/id> <reason>`").setColor("RED")]})
    }
    let razon = args.slice(1).join(" ") || "No reason!";
    if(!razon) {
      return message.channel.send({embeds: [new MessageEmbed().setDescription("Debes ingresar la razon del blacklist\nUso: `blacklist <mention/id> <reason>`").setColor("RED")]})
    }
    if(blacklist.tiene(usuario.id)) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("El usuario ya esta blacklisteado!").setColor("RED")]}) 
    }
    if(!blacklist.tiene(usuario.id)) {
        blacklist.establecer(usuario.id, {reason: razon})
        message.channel.send({
          embeds: [new MessageEmbed()
            .setTitle(""+config.TICKET["SERVER-NAME"]+" | Ticket System")
            .setDescription("**Staff Member:**: <@!"+ message.author.id+ ">\n\n ```diff\n+ "+ usuario.tag +"\n- "+razon+"```")
            .setTimestamp()
            .setColor("AQUA")
          ]
        })
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(config.TICKET['LOG-CHANNEL']).send({
            embeds: [new MessageEmbed()
              .setTitle("User Blacklisted")
              .setColor("AQUA")
              .setTimestamp()
              .setDescription("**Staff:** <@!"+ message.author.id+"> `["+ message.author.tag +"]`\n\n ```diff\n+ "+ usuario.tag +"\n- "+razon+"```")
            ]
          })
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
        return;
        }
    }
  },
};