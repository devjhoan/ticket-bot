const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "add",
    description: "add a member to a ticket",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to add',
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
        if(enable.COMMANDS.ADD === false) return;
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
        let user = interaction.options.getUser('user');
        let añadido = user.id;
        const embed2 = new MessageEmbed()
          .setDescription("```"+ mensajes['NO-TICKET-ADD'] +"```")
          .setColor("RED")
        if(!user) return interaction.reply({embeds: [embed2]})
        interaction.channel.permissionOverwrites.edit(añadido, {
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        })
        const embed = new MessageEmbed()
        .setTitle("Support System ✅")
        .setDescription(`> Staff:\n <@!${interaction.member.user.id}>\n> Miembro Añadido:\n<@!${(await client.users.fetch(añadido)).id}>`)
        .setColor("DARK_GREEN")
        .setTimestamp()
        interaction.reply({
            embeds: [embed]
        })
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
            {embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Add Member", "https://emoji.gg/assets/emoji/9846-discord-stage.png")
                .setColor("GREEN")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Add a member
                **Member Add**: <@!${user.id}>
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