const { MessageButton, MessageEmbed, Discord, MessageActionRow } = require("discord.js");
const config = require('../../config/config.json');
const client = require("../../index");
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');
let ticketNumber = new db.crearDB('ticketNumber')

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId === config["TICKET-PANEL"]["CUSTOM-ID"]){
            if(blacklist.tiene(interaction.member.user.id)) {
                let ide = interaction.member.user.id;
                let reason = await blacklist.obtener(`${ide}.reason`);
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [new MessageEmbed().setTitle("**Tried to open a ticket**").setColor("RED").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Blacklist Reason:** ${reason}\n\n**Action**: He tried to open a ticket while blacklisted!`).setFooter("Ticket System by: Jhoan#6969")]});
                return interaction.reply({embeds: [new MessageEmbed().setDescription(`Hey!, te encuentras blacklistedo por la razón:\n**${reason}**`).setColor("RED")], ephemeral: true})
            }
            if(!ticketNumber.tiene('tickets')) { ticketNumber.establecer('tickets', 0001) } else { ticketNumber.sumar('tickets', 1) }
            let numero = await ticketNumber.obtener('tickets');
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            let numnew = zeroPad(numero, 4);
            interaction.guild.channels.create(`ticket-${numnew}`, {
                type: "text",
                topic: `${interaction.member.user.id}`,
                parent: config["TICKET-PANEL"].CATEGORY,
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
                        id: config.TICKET["STAFF-ROLE"],
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
                    .setDescription("Hola "+ interaction.member.user.username +"! Nuestro equipo de soporte responderá lo antes posible.\n Mientras tanto, describa su problema aquí con el mayor detalle posible.\n\n**Ticket Type:** "+ config["TICKET-PANEL"].NAME +"\n**Ticket Owner:** "+ interaction.member.user.username + "#" + interaction.member.user.discriminator +"")
                    .setColor("AQUA")
                    .setFooter(config["TICKET-PANEL"].FOOTER, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                    channel.send({
                        content: `<@!${interaction.member.user.id}> | <@&${config.TICKET["STAFF-ROLE"]}>`,
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
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                    .setColor("GREEN")
                    .setDescription(`
                    **User**: <@!${interaction.member.user.id}>
                    **Action**: Created a ticket
                    **Panel**: ${config["TICKET-PANEL-4"].NAME}
                    **Ticket Name**: ${channel.name}`)
                    .setFooter("Ticket System by: Jhoan#6969")
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                }
            })
        }
        if(interaction.customId === config["TICKET-PANEL-2"]["CUSTOM-ID"]){
            if(blacklist.tiene(interaction.member.user.id)) {
                let ide = interaction.member.user.id;
                let reason = await blacklist.obtener(`${ide}.reason`);
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [new MessageEmbed().setTitle("**Ticket Logs**").setColor("RED").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Blacklist Reason:** ${reason}\n\n**Action**: He tried to open a ticket while blacklisted!`).setFooter("Ticket System by: Jhoan#6969")]});
                return interaction.reply({embeds: [new MessageEmbed().setDescription(`Hey!, te encuentras blacklistedo por la razón:\n**${reason}**`).setColor("RED")], ephemeral: true})
            }
            let ticketNumber = new db.crearDB('ticketNumber')
            if(!ticketNumber.tiene('tickets')) { ticketNumber.establecer('tickets', 1) } else { ticketNumber.sumar('tickets', 1) }
            let numero = await ticketNumber.obtener('tickets');
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            let numnew = zeroPad(numero, 4);
            interaction.guild.channels.create(`ticket-${numnew}`, {
                type: "text",
                topic: `${interaction.member.user.id}`,
                parent: config["TICKET-PANEL-2"].CATEGORY,
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
                        id: config.TICKET["ADMIN-ROLE"],
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
                .setDescription("Hola "+ interaction.member.user.username +"! Nuestro equipo de soporte responderá lo antes posible.\n Mientras tanto, describa su problema aquí con el mayor detalle posible.\n\n**Ticket Type:** "+ config["TICKET-PANEL-2"].NAME +"\n**Ticket Owner:** "+ interaction.member.user.username + "#" + interaction.member.user.discriminator +"")
                .setColor("AQUA")
                .setFooter(config["TICKET-PANEL-2"].FOOTER, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                    channel.send({
                        content: `<@!${interaction.member.user.id}> | <@&${config.TICKET["STAFF-ROLE"]}>`,
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
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                    .setColor("GREEN")
                    .setDescription(`
                    **User**: <@!${interaction.member.user.id}>
                    **Action**: Created a ticket
                    **Panel**: ${config["TICKET-PANEL-4"].NAME}
                    **Ticket Name**: ${channel.name}`)
                    .setFooter("Ticket System by: Jhoan#6969")
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                }
            })
        }
        if(interaction.customId === config["TICKET-PANEL-3"]["CUSTOM-ID"]){
            if(blacklist.tiene(interaction.member.user.id)) {
                let ide = interaction.member.user.id;
                let reason = await blacklist.obtener(`${ide}.reason`);
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [new MessageEmbed().setTitle("**Ticket Logs**").setColor("RED").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Blacklist Reason:** ${reason}\n\n**Action**: He tried to open a ticket while blacklisted!`).setFooter("Ticket System by: Jhoan#6969")]});
                return interaction.reply({embeds: [new MessageEmbed().setDescription(`Hey!, te encuentras blacklistedo por la razón:\n**${reason}**`).setColor("RED")], ephemeral: true})
            }
            let ticketNumber = new db.crearDB('ticketNumber')
            if(!ticketNumber.tiene('tickets')) { ticketNumber.establecer('tickets', 1) } else { ticketNumber.sumar('tickets', 1) }
            let numero = await ticketNumber.obtener('tickets');
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            let numnew = zeroPad(numero, 4);
            interaction.guild.channels.create(`ticket-${numnew}`, {
                type: "text",
                topic: `${interaction.member.user.id}`,
                parent: config["TICKET-PANEL-3"].CATEGORY,
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
                        id: config.TICKET["ADMIN-ROLE"],
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
                .setDescription("Hola "+ interaction.member.user.username +"! Nuestro equipo de soporte responderá lo antes posible.\n Mientras tanto, describa su problema aquí con el mayor detalle posible.\n\n**Ticket Type:** "+ config["TICKET-PANEL-3"].NAME +"\n**Ticket Owner:** "+ interaction.member.user.username + "#" + interaction.member.user.discriminator +"")
                .setColor("AQUA")
                .setFooter(config["TICKET-PANEL-3"].FOOTER, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                    channel.send({
                        content: `<@!${interaction.member.user.id}> | <@&${config.TICKET["STAFF-ROLE"]}>`,
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
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                    .setColor("GREEN")
                    .setDescription(`
                    **User**: <@!${interaction.member.user.id}>
                    **Action**: Created a ticket
                    **Panel**: ${config["TICKET-PANEL-4"].NAME}
                    **Ticket Name**: ${channel.name}`)
                    .setFooter("Ticket System by: Jhoan#6969")
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                }
            })
        }
        if(interaction.customId === config["TICKET-PANEL-4"]["CUSTOM-ID"]){
            if(blacklist.tiene(interaction.member.user.id)) {
                let ide = interaction.member.user.id;
                let reason = await blacklist.obtener(`${ide}.reason`);
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [new MessageEmbed().setTitle("**Ticket Logs**").setColor("RED").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Blacklist Reason:** ${reason}\n\n**Action**: He tried to open a ticket while blacklisted!`).setFooter("Ticket System by: Jhoan#6969")]});
                return interaction.reply({embeds: [new MessageEmbed().setDescription(`Hey!, te encuentras blacklistedo por la razón:\n**${reason}**`).setColor("RED")], ephemeral: true})
            }
            let ticketNumber = new db.crearDB('ticketNumber')
            if(!ticketNumber.tiene('tickets')) { ticketNumber.establecer('tickets', 1) } else { ticketNumber.sumar('tickets', 1) }
            let numero = await ticketNumber.obtener('tickets');
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            let numnew = zeroPad(numero, 4);
            interaction.guild.channels.create(`ticket-${numnew}`, {
                type: "text",
                topic: `${interaction.member.user.id}`,
                parent: config["TICKET-PANEL-4"].CATEGORY,
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
                        id: config.TICKET["ADMIN-ROLE"],
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
                .setDescription("Hola "+ interaction.member.user.username +"! Nuestro equipo de soporte responderá lo antes posible.\n Mientras tanto, describa su problema aquí con el mayor detalle posible.\n\n**Ticket Type:** "+ config["TICKET-PANEL-4"].NAME +"\n**Ticket Owner:** "+ interaction.member.user.username + "#" + interaction.member.user.discriminator +"")
                .setColor("AQUA")
                .setFooter(config["TICKET-PANEL-4"].FOOTER, client.user.displayAvatarURL())
                if(config.TICKET["MENTION-STAFF"] == true) {
                    channel.send({
                        content: `<@!${interaction.member.user.id}> | <@&${config.TICKET["STAFF-ROLE"]}>`,
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
                if(config.TICKET["LOGS-SYSTEM"] == true) {
                    const log = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                    .setColor("GREEN")
                    .setDescription(`
                    **User**: <@!${interaction.member.user.id}>
                    **Action**: Created a ticket
                    **Panel**: ${config["TICKET-PANEL-4"].NAME}
                    **Ticket Name**: ${channel.name}`)
                    .setFooter("Ticket System by: Jhoan#6969")
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});
                }
                if(config.TICKET["LOGS-SYSTEM"] == false) {
                interaction.reply({content: `Ticket created <#${channel.id}>`, ephemeral: true})
                }
            })
        }
    }
});
