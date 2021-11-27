const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "blacklist",
    description: "blacklist to a user",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to blacklist',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'reason for blacklisting',
            type: 'STRING',
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
      if(enable.COMMANDS.BLACKLIST === false) return;

      const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
      if(!interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: mensajes['NO-PERMS'], ephemeral: true})
  
      let usuario = interaction.options.getUser('user');
      if(!usuario) {
          return interaction.reply({embeds: [new MessageEmbed().setDescription(""+mensajes['MENTION-BLACKLIST']+"").setColor("RED")]})
      }
      let razon = interaction.options.getString('reason') || "No specify";
  
      let schema = {
          userID: usuario.id,
          reason: razon,
          moderator: interaction.member.user.id,
          date: new Date(),
      }
  
      if(guildData) {
        let blacklistData = guildData.usersBlacklisted.find((x) => x.userID === usuario.id)
        if(blacklistData) {
          return interaction.reply({embeds: [new MessageEmbed().setDescription(mensajes['USER-ALR-BLACKLISTED']).setColor("RED")]})
        } else {
          guildData.usersBlacklisted =  [...guildData.usersBlacklisted, schema]
          guildData.save()
          return interaction.reply({embeds: [new MessageEmbed().setDescription(mensajes['USER-BLACKLISTED']).setColor("GREEN")]})
        }
      } else {
        let newGuildData = new ticketSchema({
          guildID: interaction.guild.id,
          usersBlacklisted: [schema]
        })
        newGuildData.save()
        return interaction.reply({embeds: [new MessageEmbed().setDescription(mensajes['USER-BLACKLISTED']).setColor("GREEN")]})
      }
    },
};