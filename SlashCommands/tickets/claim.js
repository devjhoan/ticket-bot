const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "claim",
    description: "claim a ticket",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(enable.COMMANDS.CLAIM === false) return;
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true});
        if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
        const idmiembro = interaction.channel.topic;
        interaction.channel.permissionOverwrites.set([
          {
              id: interaction.guild.id,
              deny: ['VIEW_CHANNEL'],
          },
          {
              id: idmiembro,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
          },
          {
              id: interaction.member.user.id,
              allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
          },
          {
              id: config.TICKET['STAFF-ROLE'],
              deny: ['VIEW_CHANNEL'],
          }
      ]);
      const embed = new MessageEmbed()
        .setDescription("```"+ mensajes['TICKET-CLAIMED'] +" "+ interaction.user.tag +"```")
        .setColor("GREEN")
      interaction.reply({
        embeds: [embed]
      }).then((msg) => {
        msg.react("👋")
      })
      if(config.TICKET["LOGS-SYSTEM"] == true) {
        client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
          {embeds: [new MessageEmbed()
              .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Claimed", "https://emoji.gg/assets/emoji/6290-discord-invite-user.png")
              .setColor("YELLOW")
              .setDescription(`
              **User**: <@!${interaction.member.user.id}>
              **Action**: Claimed a ticket
              **Ticket Name**: ${interaction.channel.name}`)
              .setFooter("Ticket System by: Jhoan#6969")]}
      )
      }
      if(config.TICKET["LOGS-SYSTEM"] == false) {
      return;
      }
    },
};