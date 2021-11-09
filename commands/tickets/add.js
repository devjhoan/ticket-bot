const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "add",
  aliases: ["ticket-add"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.ADD === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: `${mensajes['NO-PERMS']}`}).then((msg) =>
    setTimeout(() => {
        msg.delete()
    }, 5000)
);
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    let añadido = user.id;
    const embed2 = new MessageEmbed()
      .setDescription("```"+ mensajes['NO-TICKET-ADD'] +"```")
      .setColor("RED")
    if(!user) return message.channel.send({embeds: [embed2]})
    message.channel.permissionOverwrites.edit(añadido, {
        ATTACH_FILES: true,
		    READ_MESSAGE_HISTORY: true,
		    SEND_MESSAGES: true,
		    VIEW_CHANNEL: true
    })
    const embed = new MessageEmbed()
    .setTitle("Support System ✅")
    .setDescription(`> Staff:\n <@!${message.author.id}>\n> Miembro Añadido:\n<@!${(await client.users.fetch(añadido)).id}>`)
    .setColor("DARK_GREEN")
    .setTimestamp()
    message.channel.send({
        embeds: [embed]
    })
    if(config.TICKET["LOGS-SYSTEM"] == true) {
      client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
        {embeds: [new MessageEmbed()
            .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Add Member", "https://emoji.gg/assets/emoji/9846-discord-stage.png")
            .setColor("GREEN")
            .setDescription(`
            **User**: <@!${message.member.user.id}>
            **Action**: Add a member
            **Member Add**: <@!${user.id}>
            **Ticket Name**: ${message.channel.name}
            **Ticket Owner**: <@!${message.channel.topic}>`)
            .setFooter("Ticket System by: Jhoan#6969")]}
    )
    }
    if(config.TICKET["LOGS-SYSTEM"] == false) {
    return;
    }
},
};