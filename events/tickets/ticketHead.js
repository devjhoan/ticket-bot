const client = require('../../index')
const mensajes = require('../../config/messages.json')
const config = require('../../config/config.json');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId == "TR-HEAD-STAFF") {
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                return;
            }
            if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true});
            let idmiembro = interaction.channel.topic;
            interaction.channel.permissionOverwrites.set([
                {
                    id: interaction.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: idmiembro,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
                },
                {
                    id: config.TICKET['HEAD-STAFF'],
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                },
                {
                    id: config.TICKET['STAFF-ROLE'],
                    deny: ['VIEW_CHANNEL'],
                }
            ])
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel("Close")
                    .setEmoji("🔒")
                    .setCustomId("Ticket-Open-Close"),
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel("Claim")
                    .setEmoji("👋")
                    .setDisabled(true)
                    .setCustomId("Ticket-Claimed")
            )
            interaction.message.edit({
                components: [row]
            })
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
                    {embeds: [new MessageEmbed()
                        .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket to Head!", "https://emoji.gg/assets/emoji/6290-discord-invite-user.png")
                        .setColor("YELLOW")
                        .setDescription(`
                        **User**: <@!${interaction.member.user.id}>
                        **Action**: Move the ticket a Head Staff
                        **Ticket Name**: ${interaction.channel.name}
                        **Ticket Owner**: <@!${interaction.channel.topic}>`)
                        .setFooter("Ticket System by: Jhoan#6969")]}
                )
                interaction.channel.send(`<@&${config.TICKET['HEAD-STAFF']}>`)
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        }
    }
})