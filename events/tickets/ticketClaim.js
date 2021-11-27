const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index')
const config = require('../../config/config.json');
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId == "Ticket-Claimed") {
            interaction.deferUpdate();
            const guildData = await ticketSchema.findOne({
                guildID: interaction.guild.id
            })
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            var staffRole = guildData.roles.staffRole;
            if(!interaction.member.roles.cache.get(staffRole)) {
                return;
            }
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
                    id: interaction.member.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                },
                {
                    id: staffRole,
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
            const embed = new MessageEmbed()
                .setDescription(""+ mensajes['TICKET-CLAIMED'] +" "+ interaction.member.user.tag +"")
                .setColor("GREEN");
            interaction.message.channel.send({embeds: [embed]})
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            let logcanal = guildData.channelLog;
            if(!logcanal) return;
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                interaction.client.channels.cache.get(logcanal).send(
                    {embeds: [new MessageEmbed()
                        .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Claimed", "https://emoji.gg/assets/emoji/6290-discord-invite-user.png")
                        .setColor("YELLOW")
                        .setDescription(`
                        **User**: <@!${interaction.member.user.id}>
                        **Action**: Claimed a ticket
                        **Ticket Name**: ${interaction.channel.name}
                        **Ticket Owner**: <@!${interaction.channel.topic}>`)
                        .setFooter("Ticket System by: Jhoan#6969")]}
                    
                )
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }

        }
    }
})