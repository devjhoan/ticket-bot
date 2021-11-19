const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

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
    setTimeout(() => {msg.delete()}, 5000));

    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!guildData) return message.channel.send({content: mensajes['NO-SERVER-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete() }, 5000));
    if(!guildData.tickets || guildData.tickets.length === 0) return message.channel.send({content: mensajes['NO-TICKET-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(message.channel.parentId)) return message.channel.send({content: mensajes['NO-TICKET']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!user) {
        return message.channel.send({
            embeds: [new MessageEmbed().setDescription("\❌ Hey, you didn't mention the person!").setColor("RED")]
        })
    }
    const embed = new MessageEmbed()
        .setDescription(mensajes['TICKET-ALERT'].replace('<server_name>', config.TICKET['SERVER-NAME']).replace('<user_name>', user.username))
        .setColor("YELLOW")
    user.send({embeds: [embed]})
    message.channel.send({
        embeds: [new MessageEmbed().setDescription("\✅ I have warned "+ user.username +" correctly!").setColor("GREEN")]
    })
    if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
    let logcanal = guildData.channelLog;
    if(!logcanal) return;
    if(config.TICKET["LOGS-SYSTEM"] == true) {
        client.channels.cache.get(logcanal).send(
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