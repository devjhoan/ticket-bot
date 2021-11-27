const { MessageButton, MessageEmbed, Discord, MessageActionRow } = require("discord.js");
const config = require('../../config/config.json');
const client = require("../../index");
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }

    // Handling Tickets Menu
    if(interaction.isSelectMenu()) {
        if(interaction.customId !== "SUPPORT-SYSTEM") return;
        if(!config.TICKET["NUMBER-TICKET"]) {
        let wea = interaction.values[0];
        // code main 
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id,
        })
        var staffRole = guildData.roles.staffRole;
        const guildTicket = guildData.tickets
        const Data = guildTicket.find(x => x.customID === wea);

        
        let ide = interaction.member.user.id;

        const blacklistData = guildData.usersBlacklisted;
        const findBlacklisted = blacklistData.find(user => user.userID === ide);
        if(findBlacklisted) {
            let reason = findBlacklisted.reason;
            let a = await mensajes['BLACKLISTED-MSG'].replace('<reason>', reason);
            return interaction.reply({embeds: [new MessageEmbed().setDescription(a).setColor("RED")], ephemeral: true});
        }

        interaction.guild.channels.create(`ticket-${interaction.member.user.username}`, {
            type: "text",
            topic: `${interaction.member.user.id}`,
            parent: Data.ticketCategory,
            permissionOverwrites : [
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.member.user.id,
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
                .setCustomId("Ticket-Claimed")
            )
            const welcome = new MessageEmbed()
                .setTitle(`${config.TICKET["SERVER-NAME"]} | Support Center`)
                .setDescription(mensajes["EMBED-PANEL"].replace('<meber.username>', interaction.member.user.username).replace('<ticket.type>', Data.ticketName).replace('<member.mention>', interaction.member.user))
                .setColor("AQUA")
                .setFooter(`${config.TICKET["SERVER-NAME"]} - Support System`, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                channel.send({
                    content: `<@!${interaction.member.user.id}> | <@&${staffRole}>`,
                    embeds: [welcome],
                    components: [row]
                })
            }
            if(config.TICKET["MENTION-STAFF"] == false) {
                channel.send({
                    content: `<@!${interaction.member.user.id}>`,
                    embeds: [welcome],
                    components: [row]
                })
            }
            interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            let logcanal = guildData.channelLog;
            if(!logcanal) return;
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                .setColor("GREEN")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Created a ticket
                **Panel**: ${Data.ticketName}
                **Ticket Name**: ${channel.name}`)
                .setFooter("Ticket System by: Jhoan#6969")
            interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        })
    } else {
        let wea = interaction.values[0];
        // code main 
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id,
        })
        const guildTicket = guildData.tickets
        let ticketNumber = guildData.ticketCounter;
        const Data = guildTicket.find(x => x.customID === wea);

        var staffRole = guildData.roles.staffRole;
        let ide = interaction.member.user.id;
        const blacklistData = guildData.usersBlacklisted;
        const findBlacklisted = blacklistData.find(user => user.userID === ide);
        if(findBlacklisted) {
            let reason = findBlacklisted.reason;
            let a = await mensajes['BLACKLISTED-MSG'].replace('<reason>', reason);
            return interaction.reply({embeds: [new MessageEmbed().setDescription(a).setColor("RED")], ephemeral: true});
        }

        if(ticketNumber = 0) {
            await ticketSchema.findOneAndUpdate({guildID: interaction.guild.id}, {$set: {ticketCounter: 1}})
        } else {
            await ticketSchema.findOneAndUpdate({guildID: interaction.guild.id}, {$inc: {ticketCounter: 1}})
            let numero = await ticketSchema.findOne({guildID: interaction.guild.id})
            ticketNumber = numero.ticketCounter;
            console.log(ticketNumber)
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            var numnew = zeroPad(ticketNumber, 4);
        }

        interaction.guild.channels.create(`ticket-${numnew}`, {
            type: "text",
            topic: `${interaction.member.user.id}`,
            parent: Data.ticketCategory,
            permissionOverwrites : [
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.member.user.id,
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
                .setCustomId("Ticket-Claimed")
            )
            const welcome = new MessageEmbed()
                .setTitle(`${config.TICKET["SERVER-NAME"]} | Support Center`)
                .setDescription(mensajes["EMBED-PANEL"].replace('<meber.username>', interaction.member.user.username).replace('<ticket.type>', Data.ticketName).replace('<member.mention>', interaction.member.user))
                .setColor("AQUA")
                .setFooter(`${config.TICKET["SERVER-NAME"]} - Support System`, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                channel.send({
                    content: `<@!${interaction.member.user.id}> | <@&${staffRole}>`,
                    embeds: [welcome],
                    components: [row]
                })
            }
            if(config.TICKET["MENTION-STAFF"] == false) {
                channel.send({
                    content: `<@!${interaction.member.user.id}>`,
                    embeds: [welcome],
                    components: [row]
                })
            }
            interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
            if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
            let logcanal = guildData.channelLog;
            if(!logcanal) return;
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                const log = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                .setColor("GREEN")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Created a ticket
                **Panel**: ${Data.ticketName}
                **Ticket Name**: ${channel.name}`)
                .setFooter("Ticket System by: Jhoan#6969")
            interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
        })
    }
}});
