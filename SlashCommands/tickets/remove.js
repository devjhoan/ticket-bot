const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "remove",
    description: "remove a user of a ticket",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to remove',
            type: 'USER',
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
        if(enable.COMMANDS.REMOVE === false) return;
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.followUp({content: mensajes['NO-PERMS']})
        if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.followUp({content: mensajes['NO-TICKET']})
        let si = interaction.options.getUser('user');
        let removido = si.id;
        const embed2 = new MessageEmbed()
          .setDescription("```"+ mensajes['NO-TICKET-REMOVE'] +"```")
          .setColor("RED")
        if(!si) return interaction.followUp({embeds: [embed2]})
        interaction.channel.permissionOverwrites.edit(removido, {
          VIEW_CHANNEL: false
        })
        const embed = new MessageEmbed()
        .setTitle("Support System :x:")
        .setDescription(`> Staff:\n <@!${interaction.user.id}>\n> ${mensajes['TICKET-REMOVED']}:\n<@!${(await client.users.fetch(removido)).id}>`)
        .setColor("DARK_RED")
        .setTimestamp()
        interaction.followUp({
            embeds: [embed]
        })
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
            {embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Remove Member", "https://emoji.gg/assets/emoji/1590_removed.png")
                .setColor("RED")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Remove a Member
                **Member Removed**: <@!${removido}>
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)
                .setFooter("Ticket System by: Jhoan#6969")]}
        )
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
        return;
        }
    },
};