const { MessageButton, MessageEmbed, Discord, MessageActionRow } = require("discord.js");
const config = require('../../config/config.json');
const client = require("../../index");
const mensajes = require('../../config/messages.json');

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId === "DELETE-TICKET-N") {
            if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
                return;
            }
            const embed1 = new MessageEmbed()
                .setDescription(mensajes["TICKET-STAFF-CONTROLS"]["TICKET-DELETED"])
                .setColor("DARK_RED")
            interaction.reply({embeds: [embed1]}).then((msg) => {
                setTimeout(() => {
                    interaction.channel.delete()
                }, 5000);
            })
            if(config.TICKET["LOGS-SYSTEM"] == true) {
                interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [new MessageEmbed()
                    .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Deleted", "https://emoji.gg/assets/emoji/6982_NotixDeny.png")
                    .setColor("RED")
                    .setDescription(`**User**: <@!${interaction.member.user.id}>
                    **Action**: Delete a ticket!
                    **Ticket Name**: ${interaction.channel.name}
                    **Ticket Owner**: <@!${interaction.channel.topic}>`)
                    .setFooter("Ticket System by: Jhoan#6969")]});
                if(interaction.customId === "CANCEL-TICKET-N") {
                    interaction.message.delete();
                }
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                if(interaction.customId === "CANCEL-TICKET-N") {
                    interaction.message.delete();
                }
            }
        }
    }
})
