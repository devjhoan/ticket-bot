const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
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
        {
            name: "role-1",
            description: "Role of the ticket",
            type: "ROLE",
            required: false
        },
        {
            name: "role-2",
            description: "Role of the ticket",
            type: "ROLE",
            required: false
        },
        {
            name: "role-3",
            description: "Role of the ticket",
            type: "ROLE",
            required: false
        },
        {
            name: "role-4",
            description: "Role of the ticket",
            type: "ROLE",
            required: false
        },
        {
            name: "role-5",
            description: "Role of the ticket",
            type: "ROLE",
            required: false
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
        let role2 = interaction.options.getRole("role-2");
        let role3 = interaction.options.getRole("role-3");
        let role4 = interaction.options.getRole("role-4");
        let role5 = interaction.options.getRole("role-5");

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }
        const guildData = await TicketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
        let role1 = interaction.options.getRole("role-1") || interaction.guild.roles.cache.get(guildData.roles.staffRole);

        const newTicket = {
            customID: customID,
            ticketName: Name,
            ticketDescription: Description,
            ticketCategory: Category.id,
            ticketEmoji: Emoji,
            ticketRoles: [role1 ? role1.id : null, role2 ? role2.id : role1.id, role3 ? role3.id : role1.id, role4 ? role4.id : role1.id, role5 ? role5.id : role1.id],
        }
        const roles = newTicket.ticketRoles.map(x => interaction.guild.roles.cache.get(x));
        const rolesUnique = roles.filter((v, i, a) => a.indexOf(v) === i);
        newTicket.ticketRoles = rolesUnique.map(x => x.id);
        
        if(guildData) {
            let ticketData = guildData.tickets.find((x) => x.customID === customID);
            if(ticketData) {
                return interaction.reply({content: `${mensajes["TICKET-EXISTS"]}`.replace('<custom_id>', customID), ephemeral: true})
            } else {
                guildData.tickets = [...guildData.tickets, newTicket];
            }
            await guildData.save()
        } else {
            await TicketSchema.create({
                guildID: interaction.guild.id,
                tickets: [newTicket]
            })
        }
        let embed = new MessageEmbed()
            .setTitle(`Ticket Panel configurated ✅`)
            .addField(`Custom ID`, customID, true)
            .addField(`Ticket Name`, Name, true)
            .addField(`Ticket Description`, Description, true)
            .addField(`Ticket Category`, `${Category.name}`, true)
            .addField(`Button Emoji`, Emoji, true)
            .addField(`Roles`, rolesUnique.map(x => x.name).join('\n'), true)
            .setColor('#0099ff')
        return interaction.reply({embeds: [embed], ephemeral: false})}
}