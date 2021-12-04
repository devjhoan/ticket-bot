const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, GuildApplicationCommandManager } = require("discord.js");
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
                    value: 'dropdown'
                },
                {
                    name: 'buttons',
                    value: 'buttons'
                },
                {
                    name: 'reactions',
                    value: 'reactions'
                }
            ],
        },
        {
            name: 'channel',
            description: 'Channel where the panel will be created',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: false,
        },
        {
            name: 'description',
            description: 'Do you want to enable the description in the menu? (only use in type dropdown)',
            type: 'STRING',
            choices: [
                {
                    name: 'yes',
                    value: 'yes'
                },
                {
                    name: 'no',
                    value: 'no'
                }
            ],
            required: false,
        }
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
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const description = interaction.options.getString('description');

        var newTitle = config.TICKET["SERVER-NAME"];
        var messageDescription = mensajes["MESSAGE-EMBED"];
        
        if(type == 'buttons') {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            const components = [];
            lastComponents = new MessageActionRow();
            const options = guildData.tickets.map(x => {
                return {
                    customID:  x.customID,
                    emoji:  x.ticketEmoji,
                    name: x.ticketName,
                }
            })
            for(let i = 0; i < options.length; i++) {
                if(options[i].emoji != undefined) {
                    const button = new MessageButton()
                        .setCustomId(options[i].customID)
                        .setEmoji(options[i].emoji)
                        .setStyle("SECONDARY")
                    lastComponents.addComponents(button)
                    if(lastComponents.components.length === 5) {
                        components.push(lastComponents)
                        lastComponents = new MessageActionRow();
                    }
                }
            }
            if(lastComponents.components.length > 0) {components.push(lastComponents)}
            const panelEmbed = new MessageEmbed()
                .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                .setDescription(`${messageDescription}\n\n${options.map(x => `${x.emoji} **${x.name}**`).join('\n')}`)
                .setColor("#2f3136")
            await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: components}) 
            interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
        } else if(type == 'dropdown') {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            if(description == 'no') {
                const options = guildData.tickets.map(x => {
                    return {
                        label: x.ticketName,
                        value: x.customID,
                        emoji: x.ticketEmoji,
                        name: x.ticketName,
                    }
                })
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                    .setCustomId("SUPPORT-SYSTEM")
                    .setMaxValues(1)
                    .addOptions(options)
                    )
                const panelEmbed = new MessageEmbed()
                    .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                    .setDescription(`${messageDescription}\n\n${options.map(x => `${x.emoji} **${x.name}**`).join('\n')}`)
                    .setColor("#2f3136")
                interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
                client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})
            } else {
                const options = guildData.tickets.map(x => {
                    return {
                        label: x.ticketName,
                        value: x.customID,
                        description: x.ticketDescription || "Support Ticket",
                        emoji: x.ticketEmoji,
                        name: x.ticketName,
                    }
                })
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("SUPPORT-SYSTEM")
                        .setMaxValues(1)
                        .addOptions(options)
                )
                const panelEmbed = new MessageEmbed()
                    .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                    .setDescription(`${messageDescription}\n\n${options.map(x => `${x.emoji} **${x.name}**`).join('\n')}`)
                    .setColor("#2f3136")
                await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})     
                interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
            }
        } else if(type == 'reactions') {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: `${mensajes['NO-TICKET-FIND']}`, ephemeral: true})
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            const options = guildData.tickets.map(x => {
                return {
                    emoji: x.ticketEmoji,
                    name: x.ticketName,
                }
            });
            const panelEmbed = new MessageEmbed()
                .setAuthor(`${newTitle}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
                .setDescription(`${messageDescription}\n\n${options.map(x => `${x.emoji} **${x.name}**`).join('\n')}`)
                .setColor("#2f3136")
            interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
            let react = await client.channels.cache.get(channel.id).send({embeds: [panelEmbed]})
            for(let i = 0; i < options.length; i++) {
                if(options[i].emoji != undefined) {
                    await react.react(options[i].emoji)
                }
            }
            guildData.reactionData.channel = channel.id
            guildData.reactionData.message = react.id
            await guildData.save()
        }
    },
};