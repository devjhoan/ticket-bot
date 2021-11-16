const BanSchema = require('../../models/BanSchema');
const { Client, Message, MessageEmbed } = require('discord.js');
let roles = ["» Owner", "Administrator", "Owner", "Staff Team"]

module.exports = {
  name: "bans",
  aliases: ["baneos", "user-bans", "bans-user"],
  category: ["moderation"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // if the user no haver permission to use this command, return
    if (!message.member.roles.cache.some(r => roles.includes(r.name))) {
      return message.channel.send(`${message.author} you don't have the permission to use this command!`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // set the user to check for bans
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    // if no user is mentioned, return a message
    if (!user) {
      const noUser = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("Very few arguments have been given.\n\nUsage: `bans <@user/id>`")
        .setColor('RED')
      return message.channel.send({embeds: [noUser]});
    }
    // logic

    const banDoc = await BanSchema
      .findOne({
        guildID: message.guild.id,
        memberID: user.user.id,
      })
      .catch((err) => console.log(err));

    if (!banDoc || !banDoc.bans.length) {
      return message.channel.send({content: `${user} has no bans`});
    }

    const data = [];

    for (let i = 0; banDoc.bans.length > i; i++) {
      data.push(`**ID:** ${i + 1}`);
      data.push(`**Reason:** ${banDoc.bans[i]}`);
      data.push(
        `**Moderator:** ${await message.client.users
          .fetch(banDoc.moderator[i])
          .catch(() => "Deleted User")}`
      );
      data.push(
        `**Date:** ${new Date(banDoc.date[i]).toLocaleDateString()}\n`
      );
    }

    // set a embed message
    const embed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`${user.user.tag}'s bans`)
        .setThumbnail(user.displayAvatarURL({ dynamic: false }))
        .setDescription(data.join("\n"));
    // send the embed message
    message.channel.send({embeds: [embed]});
  },
};