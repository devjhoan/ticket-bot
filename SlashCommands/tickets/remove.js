const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
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
        
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
        if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
        if(!interaction.member.roles.cache.get(guildData.roles.staffRole) && !interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})

        let si = interaction.options.getUser('user');
        let removido = si.id;
        const embed2 = new MessageEmbed()
          .setDescription("```"+ mensajes['NO-TICKET-REMOVE'] +"```")
          .setColor("RED")
        if(!si) return interaction.reply({embeds: [embed2]})
        interaction.channel.permissionOverwrites.edit(removido, {
          VIEW_CHANNEL: false
        })
        const embed = new MessageEmbed()
        .setTitle("Support System :x:")
        .setDescription(`> Staff:\n <@!${interaction.user.id}>\n> ${mensajes['TICKET-REMOVED']}:\n<@!${(await client.users.fetch(removido)).id}>`)
        .setColor("DARK_RED")
        .setTimestamp()
        interaction.reply({
            embeds: [embed]
        })
        let logcanal = guildData.channelLog;
        if(!logcanal) return;
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(logcanal).send({
            embeds: [new MessageEmbed()
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