const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const ticketSchema = require("../../models/ticketSchema");
const mensajes = require("../../config/messages");

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
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})

    if(!guildData.roles || !guildData.roles.staffRole) return message.channel.send({content: mensajes["NO-ROLES-CONFIG"]}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    if(!message.member.roles.cache.get(guildData.roles.staffRole) && !message.member.roles.cache.get(guildData.roles.adminRole)) return message.reply({content: `${mensajes['NO-PERMS']}`}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    // send the cpu usage of the bot
    let ping = Date.now() - message.createdTimestamp
    const embed = new MessageEmbed()
        .setTitle("Stats from `"+ `${message.guild.me.user.tag}` +"`")
        .setColor("AQUA")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
        .setTimestamp()
        .addField("🏓 Ping", "┕`"+ ping +"ms`", true)
        .addField("🕙 Uptime", "┕`"+ `${Math.round(client.uptime / 1000 / 60 / 60)}h, ${Math.round(client.uptime / 1000 / 60 % 60)}m, ${Math.round(client.uptime / 1000 % 60)}s` +"`", true)
        .addField("🗄️ Memory", "┕`"+ `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB` +"`", true)
        .addField("🎛️ CPU", "┕`"+`${Math.round(process.cpuUsage().user / 1024 / 1024 * 100) / 100}%`+"`", true)
        .addField("👥 Users", "┕`"+`${client.users.cache.size}`+"`", true)
        .addField("⚙️ WS Latency", "┕`"+`${client.ws.ping}`+"ms`", true)
        .addField("🤖 Version", "┕`"+`${config.VERSION}`+"`", true)
        .addField("📘 Discord.js", "┕`"+`${require('discord.js').version}`+"`", true)
        .addField("📗 Node", "┕`"+`${process.version}`+"`", true)
    message.channel.send({
        embeds: [embed]
    })
  },
};