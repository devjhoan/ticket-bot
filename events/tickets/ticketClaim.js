const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index')
const config = require('../../config/config.json');
const mensajes = require('../../config/messages.json');

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId == "Ticket-Claimed") {
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
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
                    .setCustomId("Ticket-Claimed"),
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel("Head Staff")
                    .setEmoji("880997902351208459")
                    .setDisabled(true)
                    .setCustomId("TR-HEAD-STAFF"),
            )
            interaction.message.edit({
                components: [row]
            })
            const embed = new MessageEmbed()
                .setDescription(""+ mensajes['TICKET-CLAIMED'] +" "+ interaction.member.user.tag +"")
                .setColor("GREEN")
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
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
                    interaction.message.channel.send({embeds: [embed]}).then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 3000);
                    })
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                    interaction.message.channel.send({embeds: [embed]}).then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 3000);
                    })
                }

        }
    }
})