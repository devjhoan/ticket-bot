const BanSchema = require('../../models/BanSchema');
const { Client, Message, MessageEmbed } = require('discord.js');
let roles = ["Head-Staff", "Staff-Team"]

module.exports = {
  name: "ban",
  aliases: ["user-ban", "ban-user"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const date = new Date();
    // if the user no haver permission to use this command, return
    if (!message.member.roles.cache.some(r => roles.includes(r.name))) {
      return message.channel.send(`${message.author} you don't have the permission to use this command!`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // if the bot no longer has the permission to ban members, return
    if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
      return message.channel.send(`${message.author} I do not have the permission to ban members.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // set the user to ban
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    // if no put the user to ban, the bot return
    if (!user) {
      const noUser = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("Very few arguments have been given.\n\nUsage: `ban <@user/id> [reason]`")
        .setColor('RED')
      return message.channel.send({embeds: [noUser]});
    }
    // if the user is the author of the message, return
    if (user.id === message.author.id) {
      return message.channel.send(`${message.author} You cannot ban yourself.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // if the user have a role higher than the message author, return
    // if (user.roles.highest.position >= message.member.roles.highest.position) {
    //     return message.channel.send(`${message.author} You cannot ban this user.`).then(msg => {
    //       setTimeout(() => {
    //         msg.delete();
    //         message.delete();
    //       }, 5000);
    //     });
    // }
    // if the user is the owner of the guild, return
    if (user.id === message.guild.ownerID) {
      return message.channel.send(`${message.author} You cannot ban the server owner.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // if the user is the bot, return
    if (user.id === client.user.id) {
      return message.channel.send(`${message.author} You cannot ban me.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // set the reason
    let reason = args.slice(1).join(" ") || "No reason given.";
    // if the reason is not specified, return
    if (!reason) {
      return message.channel.send(`${message.author} Please specify a reason for the ban.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
    // if the bot no have the permission to ban to the user, return
    if (!user.bannable) {
      return message.channel.send(`${message.author} I cannot ban this user.`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }

    // ban to user with the reason
    // await user.ban({
    //     reason: `${message.author.tag} - ${reason}`
    // })

    let banDoc = await BanSchema
    .findOne({
        guildID: message.guild.id,
        memberID: user.user.id
    })
    .catch((err) => console.log(err));

    if(!banDoc) {
        banDoc = new BanSchema ({
            guildID: message.guild.id,
            memberID: user.user.id,
            bans: [reason],
            moderator: [message.member.id],
            date: [Date.now()],
        });
        // send data to database
        await banDoc.save().catch((err) => console.log(err));
        // set the embed
        let embed = new MessageEmbed()
          .setTitle("User Banned ✅")
          .setColor("#ff0000")
          .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Data:** ${date.toLocaleDateString()}`)
          .setTimestamp()
        // send the embed
        message.channel.send({embeds: [embed]})
    } else {
        // send data to the database
    banDoc.bans.push(reason);
    banDoc.moderator.push(message.member.id);
    banDoc.date.push(Date.now());
    await banDoc.save().catch((err) => console.log(err))

    // set the embed
    let embed = new MessageEmbed()
    .setTitle("User Banned ✅")
    .setColor("#ff0000")
    .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Data:** ${date.toLocaleDateString()}`)
    .setTimestamp()
    // send the embed
    message.channel.send({embeds: [embed]})
    // send the embed to a channel in specified
    }
  },
};