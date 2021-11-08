const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')

module.exports = {
  name: "stats",
  aliases: ["statistics"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // if the user no have the role ADMIN-ROLE or the permission ADMINISTRATOR then return
    if (!message.member.roles.cache.has(config.TICKET['ADMIN-ROLE']) && !message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("You don't have the permission to use this command!")
    }
    // 
  },
};