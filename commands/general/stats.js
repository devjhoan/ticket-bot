const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')

const db = require('megadb');
let ticketNumber = new db.crearDB('ticketNumber')
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
    if (!message.member.roles.cache.has(config.TICKET['STAFF-ROLE']) && !message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("You don't have the permission to use this command!")
    }
    // send the cpu usage of the bot
    const embed = new MessageEmbed()
        .setTitle("Statistics")
        .setColor("AQUA")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
        .setTimestamp()
        .addField("CPU Usage", `${Math.round(process.cpuUsage().user / 1024 / 1024 * 100) / 100}%`, true)
        .addField("Memory Usage", `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`, true)
        .addField("Users", client.users.cache.size, true)
        .addField("Commands", client.commands.size, true)
        .addField("Uptime", `${Math.round(client.uptime / 1000 / 60 / 60)} hours, ${Math.round(client.uptime / 1000 / 60 % 60)} minutes, ${Math.round(client.uptime / 1000 % 60)} seconds`, true)
        .addField("Discord.js Version", `${require('discord.js').version}`, true)
        .addField("Node.js Version", `${process.version}`, true)
        .addField("Bot Version", `${config.VERSION}`, true)
        .addField("Author", `Jhoan#6969`, true)
        .addField("Tickets", await ticketNumber.get('tickets'), true)
    message.channel.send({
        embeds: [embed]
    })
  },
};