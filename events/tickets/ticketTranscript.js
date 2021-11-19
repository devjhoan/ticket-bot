const { MessageButton, MessageEmbed, MessageActionRow} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const client = require("../../index");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

client.on("interactionCreate", async (interaction) => {
    let idmiembro = interaction.channel.topic;
    if(interaction.isButton()) {
        if(interaction.customId == "Ticket-Transcript") {
            // channel transcript using mongodb
            const guildData = await ticketSchema.findOne({
                guildID: interaction.guild.id
            })
            if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            var staffRole = guildData.roles.staffRole;
            if(!guildData.channelTranscript) return interaction.reply({content: `${mensajes['NO-TRANSCRIPT-CHANNEL']}`, ephemeral: true})
            let transcriptcanal = guildData.channelTranscript;
            let logcanal = guildData.channelLog;
            if(config.TICKET["USER-SEND-TRANSCRIPT"] == false) {
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.get(staffRole)) {
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
                if(!guildData.channelLog) return;
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                    .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                    interaction.client.channels.cache.get(logcanal).send({embeds: [log]}); 
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                    return;
                }

            }
            if(config.TICKET['USER-SEND-TRANSCRIPT'] == true) {
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.get(staffRole)) {
                    return;
                }
                const trow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("TR-YES")
                        .setLabel("Yes")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("TR-CN")
                        .setLabel("Cancel")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("TR-NO")
                        .setLabel("No")
                        .setStyle("DANGER")
                )
                interaction.channel.send({
                    embeds: [new MessageEmbed().setDescription(mensajes["TICKET-STAFF-CONTROLS"]["USER-TRANSCRIPT"]).setColor("#2f3136")],
                    components: [trow]
                })
            }
        }
    }
    if(interaction.isButton()) {
        // channel transcript using mongodb
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        let transcriptcanal = guildData.channelTranscript;
        let logcanal = guildData.channelLog;
        var staffRole = guildData.roles.staffRole;
        // channel transcript using mongodb
        if(interaction.customId == "TR-CN") {
            interaction.deferUpdate();  
            if(!interaction.member.roles.cache.get(staffRole)) {
                return console.log("No tiene el rol");
            }
            interaction.message.delete();
        }
        if(interaction.customId == "TR-YES") {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.channelTranscript) return interaction.reply({content: `${mensajes['NO-TRANSCRIPT-CHANNEL']}`, ephemeral: true})
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(staffRole)) {
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
            try {
                await usu.send({
                    embeds: [mensaje],
                     files: [file]
                })
            } catch (error) {
                return interaction.message.channel.send({
                    embeds: [new MessageEmbed().setDescription(`\n❌ Error: ${error}`).setColor("RED")]
                })
            }
            // Transcipt log Channel!
            if(!guildData.channelLog) return;
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                interaction.client.channels.cache.get(logcanal).send({embeds: [log]}); 
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        }
        if(interaction.customId == "TR-NO") {
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            if(!guildData.channelTranscript) return interaction.reply({content: `${mensajes['NO-TRANSCRIPT-CHANNEL']}`, ephemeral: true})
            interaction.deferUpdate();
            if(!interaction.member.roles.cache.get(staffRole)) {
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
            if(!guildData.channelLog) return;
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed().setAuthor(""+config.TICKET["SERVER-NAME"]+" | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE")
                .setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
                interaction.client.channels.cache.get(logcanal).send({embeds: [log]}); 
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        };
    }
});