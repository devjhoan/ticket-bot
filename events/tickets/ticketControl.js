const { MessageButton, MessageEmbed, Discord, MessageAttachment, MessageActionRow} = require("discord.js");
const client = require("../../index");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');


client.on("interactionCreate", async (interaction, message) => {
    const idmiembro = interaction.channel.topic;
    if(interaction.isButton()){
    if(!interaction.member.roles.cache.get(config.TICKET["STAFF-ROLE"])) return;
    if(interaction.customId === "Ticket-Open") {
        interaction.deferUpdate();
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
            return;
        }
            setTimeout(() => {
                interaction.message.delete()
            }, 500);
        const openmed = new MessageEmbed()
            .setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TICKET-OPEN-BY"]} <@!${interaction.member.user.id}>`)
            .setColor("GREEN")
        interaction.channel.send({embeds: [openmed]})
        interaction.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: true });
        if(config.TICKET["LOGS-SYSTEM"] == true) {
            const log = new MessageEmbed()
            .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Open", "https://emoji.gg/assets/emoji/4776_Pinged_Unlocked.png")
            .setColor("YELLOW")
            .setDescription(`
            **User**: <@!${interaction.member.user.id}>
            **Action**: Re-Open a ticket
            **Ticket Name**: ${interaction.channel.name}
            **Ticket Owner**: <@!${interaction.channel.topic}>`)
            .setFooter("Ticket System by: Jhoan#6969")
        interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});   
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
            return;
        }
    }
    if(interaction.customId === "Ticket-Delete") {
        interaction.deferUpdate();
        if(!interaction.member.roles.cache.get(config.TICKET['STAFF-ROLE'])) {
            return;
        }
        const delembed = new MessageEmbed()
            .setDescription(mensajes["TICKET-STAFF-CONTROLS"]["TICKET-DELETED"])
            .setColor("RED")
        interaction.channel.send({embeds: [delembed]})
        setTimeout(() => {
            interaction.channel.delete()
            if(config.TICKET["LOGS-SYSTEM"] == false) {
                return;
            }
            const log = new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Ticket Closed", "https://emoji.gg/assets/emoji/5381_Pinged_Lock.png")
                .setColor("RED")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Close a ticket
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)
                .setFooter("Ticket System by: Jhoan#6969")
            interaction.client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send({embeds: [log]});
        }, 5000);
    }
}
});
