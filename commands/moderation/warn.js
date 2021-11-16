const WarnSchema = require('../../models/WarnSchema');
const { MessageEmbed } = require("discord.js");
let roles = ["Head-Staff", "Staff-Team"]

module.exports = {
    name: 'warn',
    description: 'warn kids',
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
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!user) {
        const warnError2 = new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription("Very few arguments have been given.\n\nUsage: `warn <@user/id> [reason]`")
          .setColor('RED')
        return message.channel.send({embeds: [warnError2]});
      }

      const MentionedPosition = user.roles.highest.MentionedPosition
      const memberPosition = message.member.roles.highest.position

      if(memberPosition <= MentionedPosition) {
          const warnError3 = new MessageEmbed()
          .setTitle('Error')
          .setDescription('You can not warn this person as their role position is higher/equal to yours')
          .setColor('RED')

          message.channel.send({embeds: [warnError3]})
      }

      const reason = args.slice(1).join(" ") || "Not Specified";

      let warnDoc = await WarnSchema
      .findOne({
          guildID: message.guild.id,
          memberID: user.user.id
      })
      .catch((err) => console.log(err));

      // la hora actual 
      const date = new Date();

      if(!warnDoc) {
          warnDoc = new WarnSchema ({
              guildID: message.guild.id,
              memberID: user.user.id,
              warnings: [reason],
              moderator: [message.member.id],
              date: [Date.now()],
          });

          await warnDoc.save().catch((err) => console.log(err));
          message.channel.send({embeds: [new MessageEmbed()
            .setTitle("User Warned ✅")
            .setColor("#ff0000")
            .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Data:** ${date.toLocaleDateString()}`)
            .setTimestamp()
          ]})

    } else {   
    warnDoc.warnings.push(reason);
    warnDoc.moderator.push(message.member.id);
    warnDoc.date.push(Date.now());

    await warnDoc.save().catch((err) => console.log(err))

    const Success = new MessageEmbed()
    .setTitle("User Warned ✅")
    .setColor("#ff0000")
    .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Data:** ${date.toLocaleDateString()}`)
    .setTimestamp()

    return message.channel.send({embeds: [Success]})
}
}
}