const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require('../../models/ticketSchema')

module.exports = {
  name: "blacklists",
  aliases: ["list-blacklists", "bls"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the user has permission to use this command
    if (!message.member.permissions.has("MANAGE_GUILD")) {
        return message.channel.send({content: mensajes['NO-PERMS']})
    }

    const blacklistList = await ticketSchema.findOne({
        guildID: message.guild.id
    })
    if(!blacklistList || !blacklistList.usersBlacklisted || blacklistList.usersBlacklisted.length == 0) {
        let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Ticket System`)
            .setDescription(`No users blacklisted`)
            .setFooter(`${message.guild.name}`, `${message.guild.iconURL({ dynamic: true })}`);
        return message.channel.send({embeds: [embed]})
    }
        const data = []
        const options = blacklistList.usersBlacklisted.map(x => {
            return {
                userID: x.userID,
                reason: x.reason,
                moderator : x.moderator,
                date: x.date
            }
        })
        for(let i = 0; i < options.length; i++) {
            let user = (await message.client.users.fetch(options[i].userID).catch(() => "Deleted User")).tag
            data.push(`**Member:** ${user}`),
            data.push(`**Moderator:** ${await message.client.users.fetch(options[i].moderator).catch(() => "Deleted User!")}`),
            data.push(`**Reason:** ${options[i].reason}`),
            data.push(`**Date:** ${new Date(options[i].date).toLocaleDateString()}\n`)
        }
        let embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`${config.TICKET['SERVER-NAME']}'s blacklists!`)
            .setThumbnail(message.guild.iconURL({ dynamic: false }))
            .setDescription(data.join("\n"));
        return message.channel.send({embeds: [embed]})
  },
};