const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "rename",
    description: "rename the name of a ticket channel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'name',
            description: 'the new name of the ticket channel',
            type: 'STRING',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(enable.COMMANDS.RENAME === false) return;
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        if(message.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
        let newName = interaction.options.getString('name');
        let channel = interaction.channel;
        if(!newName) {
            const embed2 = new MessageEmbed()
              .setDescription("```" +mensajes['NO-TICKET-RENAME']+ "```")
              .setColor("RED")
            return interaction.reply({embeds: [embed2]})
        }
        channel.edit({name: `ticket-${newName}`}, "Ticket Rename")
        const renameado = new MessageEmbed()
        .setDescription("```"+ mensajes['TICKET-RENAMED'] +" ticket-"+ newName +"```")
        .setColor("GREEN")
        interaction.reply({embeds:[renameado]})
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
            {embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Rename Ticket", "https://emoji.gg/assets/emoji/9557-pencil.png")
                .setColor("DARK_VIVID_PINK")
                .setDescription(`
                **User**: <@!${message.member.user.id}>
                **Action**: Rename a ticket!
                **Ticket Old Name**: ${channel.name}
                **Ticket New Name**: ticket-${newName}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)
                .setFooter("Ticket System by: Jhoan#6969")]}
        )
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
        return;
        }
    },
};