const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const TicketSchema = require('../../models/ticketSchema');

module.exports = {
    name: "panel-setup",
    description: "Configure the ticket panels",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "ticket-name",
            description: "Name of the ticket",
            type: "STRING",
            required: true
        },
        {
            name: "ticket-description",
            description: "Description of the ticket",
            type: "STRING",
            required: true
        },
        {
            name: "button-emoji",
            description: "Emoji id of the button",
            type: "STRING",
            required: true
        },
        {
            name: "custom-id",
            description: "Custom ID of the ticket (just put something random)",
            type: "STRING",
            required: true
        },
        {
            name: "ticket-category",
            description: "Category of the ticket",
            type: "CHANNEL",
            channelTypes: ["GUILD_CATEGORY"],
            required: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let Name = interaction.options.getString("ticket-name");
        let Description = interaction.options.getString("ticket-description");
        let Category = interaction.options.getChannel("ticket-category");
        let Emoji = interaction.options.getString("button-emoji");
        let customID = interaction.options.getString("custom-id");

        if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        
        const guildData = await TicketSchema.findOne({
            guildID: interaction.guild.id
        }).catch(err => console.log(err));
        
        const newTicket = {
            customID: customID,
            ticketName: Name,
            ticketDescription: Description,
            ticketCategory: Category.id,
            ticketEmoji: Emoji,
        }

        if(guildData) {
            let ticketData = guildData.tickets.find((x) => x.customID === customID);
            if(ticketData) {
                return interaction.reply({content: `${mensajes["TICKET-EXISTS"]}`.replace('<custom_id>', customID), ephemeral: true})
            } else {
                guildData.tickets = [...guildData.tickets, newTicket];
            }
            await guildData.save().catch(err => console.log(err));
        } else {
            await TicketSchema.create({
                guildID: interaction.guild.id,
                tickets: [newTicket]
            }).catch(err => console.log(err));
        }
        let embed = new MessageEmbed()
            .setTitle(`Ticket Panel configurated ✅`)
            .addField(`Ticket Name`, Name, true)
            .addField(`Ticket Description`, Description, true)
            .addField(`Ticket Category`, `${Category.name}`, true)
            .addField(`Button Emoji`, Emoji, true)
            .setColor('#0099ff')
        return interaction.reply({embeds: [embed], ephemeral: false})}
}