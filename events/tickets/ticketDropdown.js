const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js");
const config = require('../../config/config.json');
const client = require("../../index");
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
const getNumber = require("../../functions/numberTicket");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isSelectMenu()) {
        await interaction.deferUpdate();
        if(interaction.customId !== "SUPPORT-SYSTEM") return;
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id,})
        const Data = guildData.tickets.find(x => x.customID === interaction.values[0]);
        let staffRole = guildData.roles.staffRole;
        let memberID = interaction.member.user.id;

        interaction.editReply({embeds: [new MessageEmbed()
            .setAuthor(`${config.TICKET["SERVER-NAME"]}`, 'https://emoji.gg/assets/emoji/7607-cyansmalldot.png')
            .setDescription(`${mensajes["MESSAGE-EMBED"]}`)
            .setColor("#2f3136")]})

        let numberTicket = await getNumber(guildData.ticketCounter, ticketSchema, interaction.guild.id);

        const findBlacklisted = guildData.usersBlacklisted.find(user => user.userID === memberID)
        if(findBlacklisted) {
            return interaction.followUp({embeds: [new MessageEmbed().setColor("RED").setDescription(mensajes['BLACKLISTED-MSG'].replace('<reason>', findBlacklisted.reason))], ephemeral: true});
        }
        
        interaction.guild.channels.create(`ticket-${numberTicket}`, {
            type: "text",
            topic: `${memberID}`,
            parent: Data.ticketCategory,
            permissionOverwrites : [
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: memberID,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
                },
                {
                    id: staffRole,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
                }
            ]
        }).then(async channel => {
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
                    .setCustomId("Ticket-Claimed"))
            const welcome = new MessageEmbed()
                .setTitle(`${config.TICKET["SERVER-NAME"]} | Support Center`)
                .setDescription(mensajes["EMBED-PANEL"].replace('<member.username>', interaction.member.user.username).replace('<ticket.type>', Data.ticketName).replace('<member.mention>', interaction.member.user))
                .setColor("AQUA")
                .setFooter(`${config.TICKET["SERVER-NAME"]} - Support System`, client.user.displayAvatarURL())
            if(config.TICKET["MENTION-STAFF"]) {
                channel.send({
                    content: `<@!${memberID}> | <@&${staffRole}>`,
                    embeds: [welcome],
                    components: [row]
                })
            } else {
                channel.send({
                    content: `<@!${memberID}>`,
                    embeds: [welcome],
                    components: [row]
                })
            }
            interaction.followUp({content: `Ticket created <#${channel.id}>`, ephemeral: true})
            let channelLOG = guildData.channelLog;
            if(!channelLOG) return;
                const log = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                .setColor("GREEN")
                .setDescription(`**User**: <@!${memberID}>\n**Action**: Created a ticket\n**Panel**: ${Data.ticketName}\n**Ticket Name**: ${channel.name}`)
                .setFooter("Ticket System by: Jhoan#6969")
            interaction.client.channels.cache.get(channelLOG).send({embeds: [log]});  
        })
    }
})