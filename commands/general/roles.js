const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require('../../config/config.json')

module.exports = {
  name: "roles-panel",
  aliases: ["dr"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(!message.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return message.channel.send({content: mensajes['NO-PERMS']})
    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId("SELECT-ROLES")
            .setPlaceholder("Select your roles...")
            .setMinValues(1)
            .setMaxValues(3)
            .addOptions([
                {
                    label: "Event Notifications",
                    value: "879596021469024279",
                    emoji: "🔔"
                },
                {
                    label: "Giveaways Notifications",
                    value: "879596023624908841",
                    emoji: "🎉"
                },
                {
                    label: "Polls Notifications",
                    value: "879596024497332244",
                    emoji: "📊"
                },
            ])
    )
    const embed = new MessageEmbed()
        .setTitle("**🔔 Notification Roles**")
        .setDescription("Select the roles you want to be notified for in the server. You can recieve notifications about the following:\n\n**🔔 Event Notifications**\n**🎉 Giveaways Notifications**\n**📊 Polls Notifications**")
        .setColor("#2f3136")
    message.channel.send({
        components: [row],
        embeds: [embed],
    })
  },
};