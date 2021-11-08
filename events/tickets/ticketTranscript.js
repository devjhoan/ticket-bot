const { MessageButton, MessageEmbed, MessageActionRow} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const client = require("../../index");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');

client.on("interactionCreate", async (interaction) => {
    let idmiembro = interaction.channel.topic;
    const transcriptcanal = config.TICKET["TRANSCRIPT-CHANNEL"];
    if(interaction.isButton()) {
        if(interaction.customId === "Ticket-Transcript") {
            if(config.TICKET["USER-SEND-TRANSCRIPT"] == false) {
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                    return;
                }
                // Transcript Attachment
                const file = await discordTranscripts.createTranscript(interaction.channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `transcript-${interaction.channel.name}.html`
                });
                // Transcript message!
                const mensaje = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Transcript", "https://emoji.gg/assets/emoji/8704-archive.png")
                    .addField("Ticket Owner", `<@!${idmiembro}>`, true)
                    .addField("Ticket Name", `${interaction.channel.name}`, true)
                    .addField("Ticket Closed By:", `<@!${interaction.member.user.id}>`, true)
                    .setColor("#2f3136")
                    .setTimestamp()
                await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje], files: [file]})
                // Transcipt send to transcript channel!
                const trsend = new MessageEmbed()
                    .setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TRANSCRIPT-SAVED"]} <#${transcriptcanal}>`)
                    .setColor("GREEN")
                interaction.channel.send({embeds: [trsend]})
                // Transcipt log Channel!
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                    .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                    interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]}); 
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                    return;
                }

            }
            if(config.TICKET['USER-SEND-TRANSCRIPT'] == true) {
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                    return;
                }
                const trow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("TR-YES")
                        .setLabel("Yes")
                        .setStyle("SUCCESS")
                        .setEmoji("<:yes:874340429846425611>"),
                    new MessageButton()
                        .setCustomId("TR-CN")
                        .setLabel("Cancel")
                        .setStyle("SECONDARY")
                        .setEmoji("<:iron:875531614686416917>"),
                    new MessageButton()
                        .setCustomId("TR-NO")
                        .setLabel("No")
                        .setStyle("DANGER")
                        .setEmoji("<:no:874340458728407170>")
                )
                interaction.channel.send({
                    embeds: [new MessageEmbed().setDescription("¿Deseas enviar el ticket al usuario?").setColor("#2f3136")],
                    components: [trow]
                })
            }
        }
    }
    if(interaction.isButton) {
        if(interaction.customId == "TR-CN") {
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                return;
            }
            interaction.message.delete();
        }
        if(interaction.customId == "TR-YES") {
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                return;
            }
            interaction.message.delete()
            // Transcript Attachment
            const file = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `transcript-${interaction.channel.name}.html`
            });
            // Transcript message!
            const mensaje = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Transcript", "https://emoji.gg/assets/emoji/8704-archive.png")
                .addField("Ticket Owner", `<@!${idmiembro}>`, true)
                .addField("Ticket Name", `${interaction.channel.name}`, true)
                .addField("Ticket Closed By:", `<@!${interaction.member.user.id}>`, true)
                .setColor("#2f3136")
                .setTimestamp()
            await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje], files: [file]})
            // Transcipt send to transcript channel!
            const trsend = new MessageEmbed()
                .setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TRANSCRIPT-SAVED"]} <#${transcriptcanal}>`)
                .setColor("GREEN")
            interaction.channel.send({embeds: [trsend]})
            // Transcript send to user!
            let usu = interaction.client.users.cache.get(interaction.channel.topic);
            usu.send({
                embeds: [mensaje],
                 files: [file]
            })
            // Transcipt log Channel!
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]}); 
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        }
        if(interaction.customId == "TR-NO") {
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                return;
            }
            interaction.message.delete()
            // Transcript Attachment
            const file = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `transcript-${interaction.channel.name}.html`
            });
            // Transcript message!
            const mensaje = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Transcript", "https://emoji.gg/assets/emoji/8704-archive.png")
                .addField("Ticket Owner", `<@!${idmiembro}>`, true)
                .addField("Ticket Name", `${interaction.channel.name}`, true)
                .addField("Ticket Closed By:", `<@!${interaction.member.user.id}>`, true)
                .setColor("#2f3136")
                .setTimestamp()
            await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje], files: [file]})
            // Transcipt send to transcript channel!
            const trsend = new MessageEmbed()
                .setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TRANSCRIPT-SAVED"]} <#${transcriptcanal}>`)
                .setColor("GREEN")
            interaction.channel.send({embeds: [trsend]})
            // Transcipt log Channel!
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]}); 
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        };
    }
});