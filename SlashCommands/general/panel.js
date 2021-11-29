const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
    name: "panel",
    description: "Create the panel whit buttons",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'type',
            description: 'Type of the panel',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'dropdown',
                    value: 'ticket panel using dropdown menus'
                }
            ],
        },
        {
            name: 'channel',
            description: 'Channel where the panel will be created',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: true,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');
        var newTitle = config.TICKET["SERVER-NAME"];
        var messageDescription = mensajes["MESSAGE-EMBED"];
        
        if(type == 'ticket panel using buttons') {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            const components = [];
            lastComponents = new MessageActionRow();
            const options = guildData.tickets.map(x => {
                return {
                    customID:  x.customID,
                    emoji:  x.ticketEmoji
                }
            })
            for(let i = 0; i < options.length; i++) {
                if(options[i].emoji != undefined) {
                    const button = new MessageButton()
                        .setCustomId(options[i].customID)
                        .setEmoji(options[i].emoji)
                        .setStyle("SECONDARY")
                    lastComponents.addComponents(button)
                    if(lastComponents.components.length === 3) {
                        components.push(lastComponents)
                        lastComponents = new MessageActionRow();
                    }
                }
            }
            if(lastComponents.components.length > 0) {
                components.push(lastComponents)
            }
            const panelEmbed = new MessageEmbed()
                .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                .setDescription(`${messageDescription}`)
                .setColor("#2f3136")
            interaction.reply({content: "Panel sent correctly!", ephemeral: true})
            interaction.channel.send({embeds: [panelEmbed], components: components})
        } else {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            const options = guildData.tickets.map(x => {
                return {
                    label: x.ticketName,
                    value: x.customID,
                    description: x.ticketDescription || "Support Ticket",
                    emoji: x.ticketEmoji,
                }
            })
            const panelEmbed = new MessageEmbed()
                .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                .setDescription(`${messageDescription}`)
                .setColor("#2f3136")
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("SUPPORT-SYSTEM")
                    .setMaxValues(1)
                    .addOptions(options)
            )        
            interaction.reply({content: "Panel sent correctly!", ephemeral: true})
            client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})
        }
    },
};