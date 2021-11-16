const WarnSchema = require('../../models/WarnSchema');
const { MessageEmbed } = require("discord.js");
let roles = ["Head-Staff"]

module.exports = {
  name: 'unwarn',
  description: 'unwarn kids',
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    // if the user no haver permission to use this command, return
    if (!message.member.roles.cache.some(r => roles.includes(r.name))) {
      return message.channel.send(`${message.author} you don't have the permission to use this command!`).then(msg => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    } else if (!mentionedUser) {
      const warnError2 = new MessageEmbed() // Very few arguments have been given.
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("Very few arguments have been given.\n\nUsage: `unwarn <@user/id> <id_warn> [reason]`")
        .setColor('RED');
      return message.channel.send({ embeds: [warnError2] });
    }

    const reason = args.slice(2).join(" ") || "Not Specified";

    const WarnDoc = await WarnSchema
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedUser.user.id,
      })
      .catch((err) => console.log(err));

    if (!WarnDoc || !WarnDoc.warnings.length) {
      const warnError3 = new MessageEmbed() // if the user has no warnings, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} this user has no warnings!`)
        .setColor('RED')
      return message.channel.send({ embeds: [warnError3] })
    }

    const warnID = parseInt(args[1]);
    if (!warnID) {
      const noWarnId = new MessageEmbed() // if the user no put a warn id, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} you need to put a warn id!`)
        .setColor('RED')
      return message.channel.send({ embeds: [noWarnId] })
    }

    if (warnID <= 0 || warnID > WarnDoc.warnings.lenght) {
      const warnError4 = new MessageEmbed() // if the warn id is not valid, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} this warn id is not valid!`)
        .setColor('RED')
      return message.channel.send({ embeds: [warnError4] })
    }

    WarnDoc.warnings.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.moderator.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.date.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);

    await WarnDoc.save().catch((err) => console.log(err));

    const Success = new MessageEmbed() // the user has been successfully unwarned
      .setTitle('Success')
      .setDescription(`${message.author} has been successfully unwarned!\nReason: ${reason}`)
      .setColor('GREEN')
    message.channel.send({ embeds: [Success] })
  }
}
