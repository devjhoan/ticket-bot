const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
  name: "alert",
  aliases: ["alerta"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.ALERT === false) return;
    if(!message.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']}).then((msg) =>
    setTimeout(() => {
        msg.delete()
    }, 5000)
);
    if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return message.channel.send({content: mensajes['NO-TICKET']})
    let si = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    let user = si;
    if(!si) {
        return message.channel.send({
            embeds: [new MessageEmbed().setDescription("\❌ Hey, no has mencionado a la persona!").setColor("RED")]
        })
    }
    const embed = new MessageEmbed()
        .setDescription("Hola "+ user.username +"\n\nTienes 5 minutos para responder el ticket!\nDe lo contrario el ticket se cerrará\n\nAtte: Administracion de "+config.TICKET["SERVER-NAME"]+".")
        .setColor("YELLOW")
    user.send({embeds: [embed]})
    message.channel.send({
        embeds: [new MessageEmbed().setDescription("\✅ He avisado a "+ user.username +" correctamente!").setColor("GREEN")]
    })
    if(config.TICKET["LOGS-SYSTEM"] == true) {
        client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
            {embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Alert Member", "https://emoji.gg/assets/emoji/6773_Alert.png")
                .setColor("ORANGE")
                .setDescription(`
                **User**: <@!${message.member.user.id}>
                **Action**: Alert a member
                **Member Alert**: ${user}
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