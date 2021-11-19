const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
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
        
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
        
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
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        let logcanal = guildData.channelLog;
        if(!logcanal) return;
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(logcanal).send({
            embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Rename Ticket", "https://emoji.gg/assets/emoji/9557-pencil.png")
                .setColor("DARK_VIVID_PINK")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
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