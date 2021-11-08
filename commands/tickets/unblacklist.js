const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');

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
    if(!message.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    let usuario = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if(!usuario) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("Debes mencionar la persona a la que le deseas quitar el blacklist!\nUso: `unblacklist <mention/id>`").setColor("RED")]})
    }
    if(!blacklist.tiene(usuario.id)) {
        return message.channel.send({embeds: [new MessageEmbed().setDescription("El usuario no esta blacklisteado!").setColor("RED")]}) 
    }
    if(blacklist.tiene(usuario.id)) {
        blacklist.eliminar(usuario.id)
        message.channel.send(`${usuario.tag} ha sido unblacklisteado!`)
    }
  },
};