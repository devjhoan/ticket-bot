const { Client, Message, MessageEmbed } = require('discord.js');
let roles = ["Head-Staff"]

module.exports = {
  name: "unban",
  aliases: ["user-unban"],
  category: ["moderation"],
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
    // set the user to be unbanned
    let user = args[0];
    // if the user is not defined return
    if (!user) {
        const noUser = new MessageEmbed() // Very few arguments have been given.
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription("Very few arguments have been given.\n\nUsage: `unban <id> [reason]`")
            .setColor('RED');
      return message.channel.send({ embeds: [noUser] });
    }
    // set the reason
    let reason = args.slice(1).join(" ") || "No reason given";
    // if the reason is not defined return
    if (!reason) {
        return message.channel.send(`${message.author} please provide a reason for the unbann!`).then(msg => {
            setTimeout(() => {
              msg.delete();
              message.delete();
            }, 5000);
          });
    }
    // unban the user
    message.guild.members
    .unban(user, `${message.author.tag} - ${reason}`)
    .then((user) => {
            // set the embed
            let embed = new MessageEmbed()
                .setTitle("User UnBanned ✅")
                .setColor("#ff0000")
                .setDescription(`**User:** ${user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Data:** ${date.toLocaleDateString()}`)
                .setTimestamp()
            // send the embed
            return message.channel.send({embeds: [embed]});
    })
    .catch((err) => {
        return message.channel.send(`${message.author} the user is not banned!\n${err}`.replace('DiscordAPIError: ', ''));
    })
  },
};