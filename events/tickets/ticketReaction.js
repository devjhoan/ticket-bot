const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index')
const ticketSchema = require("../../models/ticketSchema");
const getNumber = require("../../functions/numberTicket");
const mensajes = require('../../config/messages.json');
const config = require('../../config/config.json');

client.on("ready", async () => {
    const guildData = await ticketSchema.findOne({
        guildID: client.guilds.cache.get(config["GUILD-ID"]).id
    })
    if(guildData.reactionData) {
        client.channels.cache.get(guildData.reactionData.channel).messages.fetch(guildData.reactionData.message)
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
	if(user.bot) return;
    const guildData = await ticketSchema.findOne({
        guildID: reaction.message.guild.id
    })
    if(!guildData.reactionData.channel || !guildData.reactionData.message) return;
    await client.channels.cache.get(guildData.reactionData.channel).messages.fetch(guildData.reactionData.message).then(async (message) => {
        if(reaction.message.id == message.id) {
            message.reactions.cache.get(reaction.emoji.name).users.remove(user.id);
            const Data = guildData.tickets.find(x => x.ticketEmoji === reaction.emoji.name);
            const ticketRoles = await Data.ticketRoles.map(x => {return {id: x,allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]}});   
            let staffRole = guildData.roles.staffRole;
            let memberID = user.id;
            let guildMember = message.guild.members.cache.get(user.id);

            let msg1 = await message.channel.send({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("Creating ticket...")]})
            let numberTicket = await getNumber(guildData.ticketCounter, ticketSchema, message.guild.id);

            const findBlacklisted = guildData.usersBlacklisted.find(user => user.userID === memberID)
            if(findBlacklisted) {
                return msg1.edit({embeds: [new MessageEmbed().setColor("RED").setDescription(mensajes['BLACKLISTED-MSG'].replace('<reason>', findBlacklisted.reason))], ephemeral: true}).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                });
            }
            message.guild.channels.create(`ticket-${numberTicket}`, {
                type: "text",
                topic: `${memberID}`,
                parent: Data.ticketCategory,
                permissionOverwrites : [{id: message.guild.id,deny: ["VIEW_CHANNEL"]},{id: memberID,allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]},...ticketRoles]
            }).then(async channel => {
                const row = new MessageActionRow().addComponents(
                    new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("Ticket-Open-Close"),
                    new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("Ticket-Claimed"))
                const welcome = new MessageEmbed()
                    .setTitle(`${config.TICKET["SERVER-NAME"]} | Support Center`)
                    .setDescription(mensajes["EMBED-PANEL"].replace('<member.username>', guildMember.user.username).replace('<ticket.type>', Data.ticketName).replace('<member.mention>', guildMember.user))
                    .setFooter(`${config.TICKET["SERVER-NAME"]} - Support System`, client.user.displayAvatarURL())
                    .setColor("AQUA");
                if(config.TICKET["MENTION-STAFF"]) {channel.send({content: `<@!${memberID}> | <@&${staffRole}>`,embeds: [welcome],components: [row]})
                } else {channel.send({content: `<@!${memberID}>`,embeds: [welcome],components: [row]})}
    
                msg1.edit({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Ticket created <#${channel.id}>`)], ephemeral: true}).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                })

                let channelLOG = guildData.channelLog;
                if(!channelLOG) return;
                    const log = new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Created", "https://emoji.gg/assets/emoji/1270-chat.png")
                    .setColor("GREEN")
                    .setDescription(`**User**: <@!${memberID}>\n**Action**: Created a ticket\n**Panel**: ${Data.ticketName}\n**Ticket Name**: ${channel.name}`)
                    .setFooter("Ticket System by: Jhoan#6969")
                message.client.channels.cache.get(channelLOG).send({embeds: [log]});  
            });
        }
    });
});